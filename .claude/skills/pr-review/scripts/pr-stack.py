#!/usr/bin/env python3
"""Show where a PR sits in a stack, and search the rest of the stack.

This repo stacks PRs several deep — at the time of writing, `main -> #25 -> #26
-> #21 -> #18 -> #24 -> #19`. Position in that chain decides what a finding
means, so it is worth one call to establish before reporting anything:

  * An **ancestor** supplies things. "X is missing" is wrong if the parent adds X.
  * A **descendant** may already fix things. Then the finding is not a code
    defect but a merge-ordering constraint, which is a different ask and a
    different severity.

    pr-stack.py 25
    pr-stack.py 25 --grep OrganizationJsonLd

--grep searches the diff of every *other* PR in the stack, which is how you
answer "is this already handled somewhere else in the chain?" without guessing.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys


def fail(message: str) -> None:
    print(f"pr-stack: {message}", file=sys.stderr)
    raise SystemExit(1)


def gh(args: list[str]) -> str:
    try:
        done = subprocess.run(
            ["gh", *args], capture_output=True, text=True, check=True
        )
    except FileNotFoundError:
        fail("gh CLI not found — install it with: brew install gh")
    except subprocess.CalledProcessError as exc:
        fail(f"gh {' '.join(args)} failed:\n{(exc.stderr or exc.stdout).strip()}")
    return done.stdout


def resolve_pr(raw: str) -> int:
    raw = raw.lstrip("#")
    if raw in ("current", "."):
        out = gh(["pr", "view", "--json", "number", "--jq", ".number"]).strip()
        if not out:
            fail("the current branch has no open PR")
        return int(out)
    hit = re.search(r"/pull/(\d+)", raw)
    if hit:
        return int(hit.group(1))
    if raw.isdigit():
        return int(raw)
    out = gh(
        ["pr", "list", "--state", "all", "--head", raw, "--limit", "1",
         "--json", "number", "--jq", ".[0].number // empty"]
    ).strip()
    if not out:
        fail(f"could not resolve '{raw}' to a PR")
    return int(out)


def open_prs() -> list[dict]:
    return json.loads(
        gh(["pr", "list", "--state", "open", "--limit", "100", "--json",
            "number,title,headRefName,baseRefName,author"])
    )


def build_chain(target: int, prs: list[dict]):
    by_number = {p["number"]: p for p in prs}
    by_head = {p["headRefName"]: p for p in prs}
    children: dict[str, list[dict]] = {}
    for p in prs:
        children.setdefault(p["baseRefName"], []).append(p)

    if target not in by_number:
        fail(f"PR #{target} is not open (this tool reads the open-PR graph)")

    # Walk up until the base branch has no PR of its own — that is the root.
    ancestors, seen = [], {target}
    node = by_number[target]
    while True:
        parent = by_head.get(node["baseRefName"])
        if parent is None or parent["number"] in seen:
            root = node["baseRefName"] if parent is None else None
            break
        ancestors.append(parent)
        seen.add(parent["number"])
        node = parent
    ancestors.reverse()

    # Walk down through every PR based on this one's head.
    descendants: list[tuple[int, dict]] = []

    def descend(head: str, depth: int) -> None:
        for child in sorted(children.get(head, []), key=lambda c: c["number"]):
            if child["number"] in seen:
                continue
            seen.add(child["number"])
            descendants.append((depth, child))
            descend(child["headRefName"], depth + 1)

    descend(by_number[target]["headRefName"], 0)
    return by_number[target], ancestors, descendants, root


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pr", help="PR number, #number, URL, branch, or 'current'")
    parser.add_argument(
        "--grep", metavar="PATTERN",
        help="search the diff of every other PR in the stack for this regex",
    )
    parser.add_argument(
        "--context", type=int, default=0, metavar="N",
        help="lines of context around each --grep match (default 0)",
    )
    args = parser.parse_args()

    target_num = resolve_pr(args.pr)
    target, ancestors, descendants, root = build_chain(target_num, open_prs())

    print(f"Stack around PR #{target_num}\n")
    if root:
        print(f"  {root}  (no PR — the root of this chain)")
    for i, pr in enumerate(ancestors):
        print(f"  {'  ' * (i + 1)}#{pr['number']}  {pr['title']}"
              f"   [ancestor — supplies things to #{target_num}]")
    base_indent = "  " * (len(ancestors) + 1)
    print(f"  {base_indent}#{target['number']}  {target['title']}   <== you are reviewing this")
    for depth, pr in descendants:
        print(f"  {base_indent}{'  ' * (depth + 1)}#{pr['number']}  {pr['title']}"
              f"   [descendant — may already fix things]")

    if not ancestors and not descendants:
        print("\nNot stacked — this PR targets a branch with no open PR, and nothing "
              "is stacked on it. Findings stand on their own.")
    else:
        print(f"\n{len(ancestors)} ancestor(s), {len(descendants)} descendant(s). "
              "Before calling something missing, check the ancestors; before calling "
              "something broken, check whether a descendant fixes it.")

    if not args.grep:
        return

    others = [pr for pr in ancestors] + [pr for _, pr in descendants]
    if not others:
        print(f"\nNothing else in the stack to search for {args.grep!r}.")
        return

    print(f"\n--- '{args.grep}' across the rest of the stack ---")
    pattern = re.compile(args.grep)
    any_hit = False
    for pr in others:
        diff = gh(["pr", "diff", str(pr["number"])]).splitlines()
        hits = [i for i, line in enumerate(diff) if pattern.search(line)]
        if not hits:
            continue
        any_hit = True
        role = "ancestor" if pr in ancestors else "descendant"
        print(f"\n#{pr['number']} ({role}) — {pr['title']}")
        shown: set[int] = set()
        for i in hits:
            lo = max(0, i - args.context)
            hi = min(len(diff), i + args.context + 1)
            for j in range(lo, hi):
                if j not in shown:
                    shown.add(j)
                    print(f"    {diff[j]}")
    if not any_hit:
        print(f"\nNo PR in the stack touches {args.grep!r}.")


if __name__ == "__main__":
    main()
