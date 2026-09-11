#!/usr/bin/env python3
"""Publish a review to a GitHub PR without letting one bad line number sink it.

GitHub rejects an entire review if any single inline comment points at a line
that is not part of the diff, which is the usual way a generated review dies.
This script parses the real hunks first, posts only the comments that anchor,
and folds the rest into the summary body so no finding is silently dropped.

    post-review.py --pr 25 --body report.md
    post-review.py --pr 25 --body report.md --comments findings.json --dry-run

findings.json is a list of objects:

    [
      {"path": "src/consts.ts", "line": 42, "body": "..."},
      {"path": "src/Hero.astro", "line": 18, "start_line": 12, "body": "..."},
      {"path": "src/old.ts", "line": 7, "side": "LEFT", "body": "..."}
    ]

`side` defaults to RIGHT (the new state). `start_line` makes it a range.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys

HUNK = re.compile(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@")


def fail(message: str) -> None:
    print(f"post-review: {message}", file=sys.stderr)
    raise SystemExit(1)


def gh(args: list[str], stdin: str | None = None) -> str:
    try:
        done = subprocess.run(
            ["gh", *args],
            input=stdin,
            capture_output=True,
            text=True,
            check=True,
        )
    except FileNotFoundError:
        fail("gh CLI not found — install it with: brew install gh")
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "").strip()
        fail(f"gh {' '.join(args)} failed:\n{detail}")
    return done.stdout


def commentable_lines(pr: int) -> dict[str, dict[str, set[int]]]:
    """Map each changed file to the line numbers GitHub will accept a comment on.

    Only lines that appear in a hunk are addressable, and their number depends
    on the side: RIGHT counts added and context lines in the new file, LEFT
    counts removed and context lines in the old one.
    """
    raw = gh(
        [
            "api",
            f"repos/{{owner}}/{{repo}}/pulls/{pr}/files",
            "--paginate",
            "--jq",
            ".[] | {filename, patch}",
        ]
    )

    anchors: dict[str, dict[str, set[int]]] = {}
    for line in raw.splitlines():
        if not line.strip():
            continue
        entry = json.loads(line)
        path = entry["filename"]
        patch = entry.get("patch")
        right: set[int] = set()
        left: set[int] = set()

        if patch:
            old = new = 0
            for row in patch.splitlines():
                header = HUNK.match(row)
                if header:
                    old = int(header.group(1))
                    new = int(header.group(3))
                    continue
                if row.startswith("\\"):  # "\ No newline at end of file"
                    continue
                if row.startswith("+"):
                    right.add(new)
                    new += 1
                elif row.startswith("-"):
                    left.add(old)
                    old += 1
                else:  # context line, present on both sides
                    right.add(new)
                    left.add(old)
                    new += 1
                    old += 1

        anchors[path] = {"RIGHT": right, "LEFT": left}
    return anchors


def partition(comments: list[dict], anchors: dict[str, dict[str, set[int]]]):
    """Split comments into ones GitHub will accept and ones it would reject."""
    keep: list[dict] = []
    orphans: list[tuple[dict, str]] = []

    for raw in comments:
        missing = [k for k in ("path", "line", "body") if not raw.get(k)]
        if missing:
            orphans.append((raw, f"missing required field(s): {', '.join(missing)}"))
            continue

        path = raw["path"]
        side = (raw.get("side") or "RIGHT").upper()
        if side not in ("RIGHT", "LEFT"):
            orphans.append((raw, f"side must be RIGHT or LEFT, got {side!r}"))
            continue

        if path not in anchors:
            orphans.append((raw, "this PR does not touch that file"))
            continue

        valid = anchors[path][side]
        if not valid:
            orphans.append((raw, f"no {side} lines in the diff (binary or pure rename?)"))
            continue

        try:
            line = int(raw["line"])
        except (TypeError, ValueError):
            orphans.append((raw, f"line is not a number: {raw['line']!r}"))
            continue

        if line not in valid:
            nearest = min(valid, key=lambda candidate: abs(candidate - line))
            orphans.append(
                (raw, f"line {line} is outside the diff hunks (nearest usable: {nearest})")
            )
            continue

        payload = {"path": path, "line": line, "side": side, "body": raw["body"]}

        if raw.get("start_line"):
            start = int(raw["start_line"])
            if start not in valid or start >= line:
                orphans.append(
                    (raw, f"start_line {start} is not a usable line above {line}")
                )
                continue
            payload["start_line"] = start
            payload["start_side"] = side

        keep.append(payload)

    return keep, orphans


def append_orphans(body: str, orphans: list[tuple[dict, str]]) -> str:
    if not orphans:
        return body

    chunks = [
        body.rstrip(),
        "",
        "---",
        "",
        "### Findings without a diff anchor",
        "",
        "These could not be attached to a line, so they are collected here:",
        "",
    ]
    for raw, reason in orphans:
        where = f"`{raw.get('path', '?')}:{raw.get('line', '?')}`"
        chunks.append(f"- **{where}** — {str(raw.get('body', '')).strip()}")
        chunks.append(f"  <sub>not inlined: {reason}</sub>")
    return "\n".join(chunks)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pr", type=int, required=True, help="PR number")
    parser.add_argument(
        "--body", required=True, help="markdown summary file, or - for stdin"
    )
    parser.add_argument("--comments", help="JSON file of inline comments")
    parser.add_argument(
        "--event",
        default="COMMENT",
        choices=["COMMENT", "REQUEST_CHANGES", "APPROVE"],
        help="review verdict (default COMMENT)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="summarise what would be posted and exit without touching GitHub",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="with --dry-run, dump the full JSON payload instead of a summary",
    )
    args = parser.parse_args()

    body = sys.stdin.read() if args.body == "-" else open(args.body).read()
    if not body.strip():
        fail("the review body is empty; GitHub rejects a review with no body")

    comments: list[dict] = []
    if args.comments:
        with open(args.comments) as handle:
            comments = json.load(handle)
        if not isinstance(comments, list):
            fail("--comments must contain a JSON array of comment objects")

    anchored, orphans = partition(comments, commentable_lines(args.pr) if comments else {})
    body = append_orphans(body, orphans)

    payload: dict = {"body": body, "event": args.event}
    if anchored:
        payload["comments"] = anchored

    for raw, reason in orphans:
        print(
            f"post-review: moved {raw.get('path', '?')}:{raw.get('line', '?')} "
            f"into the summary — {reason}",
            file=sys.stderr,
        )

    if args.dry_run:
        print(f"--- dry run: PR #{args.pr}, event {args.event} ---")
        print(f"body: {len(body)} chars, {len(body.splitlines())} lines")
        print(f"inline: {len(anchored)} anchored, {len(orphans)} folded into the body")

        if args.verbose:
            # Only on request: the caller wrote this text, so echoing all of it
            # back is a large amount of context spent confirming what they know.
            print()
            print(json.dumps(payload, indent=2, ensure_ascii=False))
            return

        if anchored:
            print()
            width = max(len(f"{c['path']}:{c['line']}") for c in anchored)
            for c in anchored:
                where = f"{c['path']}:{c['line']}"
                first = " ".join(c["body"].split())[:70]
                print(f"  {c['side']:<5} {where:<{width}}  {first}…")

        print("\nRe-run without --dry-run to post it. Add --verbose for the full payload.")
        return

    out = gh(
        [
            "api",
            "--method",
            "POST",
            f"repos/{{owner}}/{{repo}}/pulls/{args.pr}/reviews",
            "--input",
            "-",
            "--jq",
            ".html_url",
        ],
        stdin=json.dumps(payload),
    )
    print(f"Review posted: {out.strip()}")


if __name__ == "__main__":
    main()
