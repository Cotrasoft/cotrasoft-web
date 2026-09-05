#!/usr/bin/env python3
"""Grade every run in an iteration and write the grading.json the viewer reads.

Mechanical assertions are decided here. Assertions that need judgement are
decided by a keyword probe and always carry the matching text as evidence, so a
human can overrule the machine rather than trust it.
"""

from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).parent
ITER = ROOT / "iteration-1"
GRADE = ROOT / "grade.py"
PR_FOR = {"stacked-pr-i18n": 21, "dependabot-brevity": 30, "no-target-lists-prs": None}


def probe(text: str, pattern: str) -> str | None:
    """Return the first matching line, so evidence is quotable."""
    for line in text.splitlines():
        if re.search(pattern, line, re.IGNORECASE):
            return " ".join(line.split())[:220]
    return None


def mechanical(review: str, pr: int | None) -> dict:
    cmd = [sys.executable, str(GRADE), "--review", review, "--json"]
    if pr:
        cmd += ["--pr", str(pr)]
    done = subprocess.run(cmd, capture_output=True, text=True)
    if done.returncode != 0 or not done.stdout.strip():
        raise RuntimeError(f"grade.py failed on {review}: {done.stderr.strip()[:300]}")
    return json.loads(done.stdout)


def assertions_for(name: str, text: str, m: dict) -> list[dict]:
    cites = m.get("citations", {"total": 0, "invalid": 0})
    links = m.get("permalinks", {"total": 0, "invalid": 0})
    out = [
        {"text": "Every file:line cited resolves to a real file and an in-range line",
         "passed": cites["invalid"] == 0,
         "evidence": f"{cites['total'] - cites['invalid']}/{cites['total']} valid"
                     + ("" if cites["invalid"] == 0 else
                        "; bad: " + "; ".join(d["citation"] + " -> " + d.get("why", "")
                                              for d in cites["details"] if not d["ok"]))},
        {"text": "Every permalink uses a full head SHA and an existing path/line range",
         "passed": links["invalid"] == 0,
         "evidence": f"{links['total'] - links['invalid']}/{links['total']} valid"},
        {"text": "Makes no claim about the build, types, or lint failing",
         "passed": not m["unearned_claims"],
         "evidence": "none found" if not m["unearned_claims"]
                     else m["unearned_claims"][0]["context"]},
        {"text": "Does not flag the four Biome-exempt rules",
         "passed": not m["biome_exempt_mentions"],
         "evidence": "none found" if not m["biome_exempt_mentions"]
                     else m["biome_exempt_mentions"][0]["context"]},
    ]

    if name == "stacked-pr-i18n":
        base = probe(text, r"unify-entity-narrative|stack|apilad")
        trap = probe(text, r"(description|descripci).{0,60}(no localiz|sin localiz|not localiz|falta|forgot|missing)")
        mism = probe(text, r"SITE_METADATA")
        out += [
            {"text": "Accounts for the stack: names the real base or the chain",
             "passed": base is not None, "evidence": base or "no mention found"},
            {"text": "Does NOT report the meta description as left unlocalized (the trap)",
             "passed": trap is None, "evidence": trap or "no such claim — trap avoided"},
            {"text": "Catches that the PR body promises SITE_METADATA, which the code lacks",
             "passed": mism is not None, "evidence": mism or "not mentioned"},
            {"text": "Verdict leads the findings",
             "passed": m["verdict"]["leads_findings"],
             "evidence": f"verdict present={m['verdict']['present']}"},
        ]
    elif name == "dependabot-brevity":
        bot = probe(text, r"dependabot|\bbot\b|automat")
        pin = probe(text, r"biome\.yml|setup-biome|2\.5\.8")
        tests = probe(text, r"(add|agrega|falta).{0,30}(tests?|pruebas)")
        out += [
            {"text": "Identifies the PR as a bot-opened dependency bump",
             "passed": bot is not None, "evidence": bot or "no mention found"},
            {"text": "Flags that the CI workflow still pins Biome 2.5.8",
             "passed": pin is not None, "evidence": pin or "MISSED the CI pin skew"},
            {"text": "Does not ask for tests to be added",
             "passed": tests is None, "evidence": tests or "no request for tests"},
            {"text": "Verdict leads the findings",
             "passed": m["verdict"]["leads_findings"],
             "evidence": f"verdict present={m['verdict']['present']}"},
        ]
    else:
        numbers = set(re.findall(r"#(\d\d)\b", text))
        asks = probe(text, r"(cu[aá]l|which|qu[eé] PR|te[ln]?[eé]s|dec[ií]me|let me know)\s*.{0,40}\?")
        reviewed = sum(m["severity_tags"].values())
        out += [
            {"text": "Lists several open PRs by number",
             "passed": len(numbers) >= 5,
             "evidence": f"{len(numbers)} PR numbers: {sorted(numbers)}"},
            {"text": "Asks which PR to review instead of picking one",
             "passed": asks is not None, "evidence": asks or "no question found"},
            {"text": "Does not deliver a full review of any single PR",
             "passed": reviewed == 0,
             "evidence": f"{reviewed} severity-tagged findings present"},
        ]
    return out


def main() -> None:
    rows = []
    for name, pr in PR_FOR.items():
        for config in ("with_skill", "without_skill"):
            review = ITER / name / config / "outputs" / "review.md"
            if not review.exists():
                continue
            m = mechanical(str(review), pr)
            checks = assertions_for(name, review.read_text(), m)
            passed = sum(1 for c in checks if c["passed"])
            (ITER / name / config / "grading.json").write_text(
                json.dumps({"eval_name": name, "config": config,
                            "expectations": checks,
                            "score": f"{passed}/{len(checks)}"}, indent=2,
                           ensure_ascii=False) + "\n")
            rows.append((name, config, passed, len(checks), checks))

    print(f"{'eval':<22} {'config':<14} score")
    for name, config, p, t, _ in rows:
        print(f"{name:<22} {config:<14} {p}/{t}")

    print("\n--- failures, with evidence ---")
    for name, config, _, _, checks in rows:
        for c in checks:
            if not c["passed"]:
                print(f"\n{name} / {config}\n  FAIL {c['text']}\n       {c['evidence']}")


if __name__ == "__main__":
    main()
