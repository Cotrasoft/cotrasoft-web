#!/usr/bin/env python3
"""Check a review against the assertions that can be verified mechanically.

The headline check is citation validity. A review's whole value rests on its
findings being real, and the cheapest way to be fake is to cite a file:line that
does not exist — wrong path, or a line past the end of the file. That is
checkable, so it gets checked rather than eyeballed.

Everything this reports is evidence for a human to read, not a verdict. Phrase
matching in particular over-fires: a review that says "do not claim this breaks
the build" would match the very pattern it is disclaiming, which is why every
hit is printed with its surrounding text.

    grade.py --review path/to/review.md --pr 21
    grade.py --review path/to/review.md --pr 21 --json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

EXT = "ts|tsx|js|jsx|mjs|cjs|astro|json|jsonc|md|mdx|css|ya?ml|txt|toml"
CITATION = re.compile(rf"`?([A-Za-z0-9_./\-]+\.(?:{EXT}))`?:(\d+)(?:\s*[-–]\s*(\d+))?")

# The skill asks for full-SHA permalinks in published reviews, so a dead one is
# a real defect: the reader clicks and gets nothing.
PERMALINK = re.compile(
    r"https?://github\.com/[^/\s]+/[^/\s]+/blob/([0-9a-f]{7,40})/([^\s#)]+)"
    r"(?:#L(\d+)(?:-L(\d+))?)?"
)

# Claims the skill has no standing to make: it never builds or lints the branch.
UNEARNED_CLAIMS = [
    r"(fails?|failing|breaks?|broke|will fail)\s+the\s+build",
    r"(won'?t|will not|does not|doesn'?t)\s+compile",
    r"no\s+compila|rompe\s+(el\s+)?build|falla\s+(el\s+)?build",
    r"(fails?|violates?)\s+lint|lint\s+(will\s+)?fails?",
    r"type\s+error(s)?\s+(here|in\s+this)",
]

BIOME_EXEMPT = ["useConst", "useImportType", "noUnusedVariables", "noUnusedImports"]

VERDICT_WORDS = [
    "veredicto", "verdict", "listo para merge", "ready to merge",
    "cambios requeridos", "changes requested", "request changes", "bloqueado",
]


def gh_or_git(args: list[str]) -> str:
    try:
        return subprocess.run(args, capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:
        return ""


def pr_tree(pr: int) -> tuple[str, list[str]]:
    sha = gh_or_git(["gh", "pr", "view", str(pr), "--json", "headRefOid",
                     "--jq", ".headRefOid"]).strip()
    if not sha:
        print(f"grade: could not resolve head SHA for PR #{pr}", file=sys.stderr)
        raise SystemExit(1)
    have = subprocess.run(["git", "cat-file", "-e", f"{sha}^{{commit}}"],
                          capture_output=True).returncode == 0
    if not have:
        subprocess.run(["git", "fetch", "-q", "origin", f"refs/pull/{pr}/head"],
                       capture_output=True)
    files = gh_or_git(["git", "ls-tree", "-r", "--name-only", sha]).splitlines()
    return sha, [f for f in files if f]


def line_count(sha: str, path: str) -> int | None:
    out = gh_or_git(["git", "show", f"{sha}:{path}"])
    return out.count("\n") if out else None


def check_citations(text: str, sha: str, files: list[str]) -> dict:
    results = []
    for match in CITATION.finditer(text):
        raw, start, end = match.group(1), int(match.group(2)), match.group(3)
        # removeprefix, not lstrip: lstrip("./") strips every leading "." and "/"
        # character, which turns ".github/workflows/x.yml" into
        # "github/workflows/x.yml" and reports a valid citation as fabricated.
        target = raw.removeprefix("./")

        if target in files:
            path = target
        else:
            # Reviews often cite a bare filename (legal.ts:237). Accept it only
            # when exactly one tree entry matches, so an ambiguous name is not
            # silently blessed.
            tail = [f for f in files if f.endswith("/" + target) or f == target]
            path = tail[0] if len(tail) == 1 else None

        if path is None:
            # A review may legitimately cite files that are not in the PR tree
            # at all — `.claude/rules/*` is untracked in this repo, so quoting
            # the rulebook would otherwise be scored as a fabricated path.
            # Kept as its own category rather than folded into ok, because
            # "exists on disk" is a weaker claim than "exists on the branch".
            if os.path.exists(target):
                results.append({"citation": match.group(0), "ok": True,
                                "resolved": f"{target} (local file, untracked in the PR)"})
            else:
                results.append({"citation": match.group(0), "ok": False,
                                "why": "path is in neither the PR tree nor the working directory"})
            continue

        total = line_count(sha, path)
        top = int(end) if end else start
        if total is None:
            results.append({"citation": match.group(0), "ok": False,
                            "why": f"{path} is unreadable at this commit"})
        elif top > total:
            results.append({"citation": match.group(0), "ok": False,
                            "why": f"{path} has {total} lines, cited {top}"})
        else:
            results.append({"citation": match.group(0), "ok": True,
                            "resolved": f"{path}:{start}"})

    bad = [r for r in results if not r["ok"]]
    return {"total": len(results), "invalid": len(bad), "details": results}


def check_permalinks(text: str, sha: str, files: list[str]) -> dict:
    results = []
    for m in PERMALINK.finditer(text):
        link_sha, path, start, end = m.group(1), m.group(2), m.group(3), m.group(4)
        problems = []

        if len(link_sha) < 40:
            problems.append(f"SHA is {len(link_sha)} chars, not the full 40 "
                            "(short SHAs and branch names go stale)")
        if not sha.startswith(link_sha):
            problems.append("SHA is not this PR's head")
        if path not in files:
            problems.append("path does not exist at that commit")
        elif start:
            total = line_count(sha, path)
            top = int(end) if end else int(start)
            if total is not None and top > total:
                problems.append(f"{path} has {total} lines, linked {top}")

        results.append({"link": f"{path}#L{start or '?'}", "ok": not problems,
                        "why": "; ".join(problems)})

    return {"total": len(results),
            "invalid": len([r for r in results if not r["ok"]]),
            "details": results}


def find_phrases(text: str, patterns: list[str]) -> list[dict]:
    hits = []
    for pat in patterns:
        for m in re.finditer(pat, text, re.IGNORECASE):
            lo, hi = max(0, m.start() - 90), min(len(text), m.end() + 90)
            hits.append({"pattern": pat,
                         "context": " ".join(text[lo:hi].split())})
    return hits


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--review", required=True)
    ap.add_argument("--pr", type=int, help="omit for reviews with no single PR target")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    text = open(args.review).read()
    report: dict = {"review": args.review, "chars": len(text)}

    if args.pr:
        sha, files = pr_tree(args.pr)
        report["head_sha"] = sha
        report["citations"] = check_citations(text, sha, files)
        report["permalinks"] = check_permalinks(text, sha, files)

    report["unearned_claims"] = find_phrases(text, UNEARNED_CLAIMS)
    report["biome_exempt_mentions"] = find_phrases(
        text, [rf"\b{re.escape(r)}\b" for r in BIOME_EXEMPT]
    )

    lowered = text.lower()
    verdict_at = min(
        (lowered.find(w) for w in VERDICT_WORDS if lowered.find(w) >= 0), default=-1
    )
    finding_at = min(
        (m.start() for m in re.finditer(r"^#{2,4}\s*\[|^\s*[-*]\s*\[", text, re.M)),
        default=len(text),
    )
    report["verdict"] = {
        "present": verdict_at >= 0,
        "leads_findings": 0 <= verdict_at < finding_at,
    }
    report["severity_tags"] = {
        tag: len(re.findall(rf"\[{tag}\]", text, re.IGNORECASE))
        for tag in ("bloqueante", "blocker", "importante", "important", "nit", "pregunta", "question")
    }

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
        return

    print(f"== {args.review}  ({len(text)} chars)")
    if "citations" in report:
        c = report["citations"]
        print(f"\ncitations: {c['total']} found, {c['invalid']} invalid")
        for d in c["details"]:
            flag = "ok  " if d["ok"] else "BAD "
            extra = d.get("resolved") or d.get("why")
            print(f"  {flag}{d['citation']}  -> {extra}")

        p = report["permalinks"]
        print(f"\npermalinks: {p['total']} found, {p['invalid']} invalid")
        for d in p["details"]:
            flag = "ok  " if d["ok"] else "BAD "
            print(f"  {flag}{d['link']}{'  -> ' + d['why'] if d['why'] else ''}")
    for key, label in (("unearned_claims", "build/lint claims it cannot make"),
                       ("biome_exempt_mentions", "Biome-exempt rules mentioned")):
        hits = report[key]
        print(f"\n{label}: {len(hits)}")
        for h in hits:
            print(f"  ...{h['context']}...")
    v = report["verdict"]
    print(f"\nverdict present: {v['present']}   leads the findings: {v['leads_findings']}")
    tags = {k: n for k, n in report["severity_tags"].items() if n}
    print(f"severity tags: {tags or 'none'}")


if __name__ == "__main__":
    main()
