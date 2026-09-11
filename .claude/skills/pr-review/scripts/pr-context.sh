#!/usr/bin/env bash
#
# Gather everything a reviewer needs about a pull request in a single call.
#
#   pr-context.sh              # no target given -> list open PRs and stop
#   pr-context.sh 25           # by number
#   pr-context.sh '#25'        # by number, hash form
#   pr-context.sh https://github.com/Cotrasoft/cotrasoft-web/pull/25
#   pr-context.sh feat/about-entity-page   # by head branch
#   pr-context.sh current      # the PR for the branch you are on
#
# Env:
#   MAX_DIFF_LINES  truncate the diff past this many lines (default 3000)
#   PRIOR_PRS       how many earlier PRs on the same files to mine (default 5, 0 skips)
#   PRIOR_COMMENTS  total prior-art comments to show across those PRs (default 10)
#
set -euo pipefail

MAX_DIFF_LINES="${MAX_DIFF_LINES:-3000}"
PRIOR_PRS="${PRIOR_PRS:-5}"
PRIOR_COMMENTS="${PRIOR_COMMENTS:-10}"

SCRIPT_NAME=pr-context
# shellcheck source=_pr-lib.sh
. "$(cd "$(dirname "$0")" && pwd)/_pr-lib.sh"

require_gh

# ---------------------------------------------------------------- list mode --

if [ "$#" -eq 0 ] || [ -z "${1:-}" ]; then
  printf '## Open pull requests\n\n'
  gh pr list --state open --limit 30 \
    --json number,title,author,baseRefName,headRefName,additions,deletions,changedFiles,isDraft,updatedAt \
    --jq '.[] |
      "#\(.number)  \(if .isDraft then "[draft] " else "" end)\(.title)
    \(.author.login) · \(.headRefName) → \(.baseRefName) · +\(.additions)/-\(.deletions) in \(.changedFiles) files · updated \(.updatedAt[0:10])
"'

  current="$(gh pr view --json number --jq '.number' 2>/dev/null || true)"
  if [ -n "$current" ]; then
    printf 'The branch you are on has PR #%s.\n\n' "$current"
  fi
  printf 'Re-run with a target to pull full context: pr-context.sh <number|url|branch>\n'
  exit 0
fi

# ------------------------------------------------------------ resolve target --

PR="$(resolve_pr "$1")"

# ------------------------------------------------------------------ metadata --

printf '## PR #%s\n\n' "$PR"
gh pr view "$PR" \
  --json title,url,author,baseRefName,headRefName,headRefOid,isDraft,state,mergeable,additions,deletions,changedFiles,labels,createdAt,updatedAt \
  --jq '"title:     \(.title)
url:       \(.url)
author:    \(.author.login)\(if .author.is_bot then " (BOT)" else "" end)
state:     \(.state)\(if .isDraft then " (DRAFT)" else "" end)
mergeable: \(.mergeable)
base:      \(.baseRefName)  <-  head: \(.headRefName)
head sha:  \(.headRefOid)
size:      +\(.additions)/-\(.deletions) across \(.changedFiles) files
labels:    \(if (.labels | length) > 0 then (.labels | map(.name) | join(", ")) else "none" end)
opened:    \(.createdAt[0:10])   updated: \(.updatedAt[0:10])"'

# --------------------------------------------------------------- eligibility --
# Cheap guards so a review is not spent on something that does not want one.

printf '\n\n## Eligibility\n\n'
elig="$(gh pr view "$PR" --json state,isDraft,author --jq \
  '[ (if .state != "OPEN" then "state is \(.state) — a review here may be moot" else empty end),
     (if .isDraft then "marked DRAFT — the author may not be asking yet" else empty end),
     (if .author.is_bot then "opened by a bot — use the dependency lens, keep it short" else empty end)
   ] | .[]')"

me="$(gh api user --jq '.login' 2>/dev/null || true)"
if [ -n "$me" ]; then
  mine="$(gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --paginate \
    --jq "[.[] | select(.user.login == \"$me\")] | length" 2>/dev/null || echo 0)"
  if [ "${mine:-0}" -gt 0 ]; then
    elig="$elig
you (@$me) already left $mine review(s) — re-review only the new commits, do not repeat yourself"
  fi
fi

if [ -z "$(printf '%s' "$elig" | tr -d '[:space:]')" ]; then
  printf 'Clear — open, not a draft, human author, not yet reviewed by you.\n'
else
  printf '%s\n' "$elig" | sed '/^$/d;s/^/- /'
  printf '\nRaise this with the user before spending a full review.\n'
fi

# -------------------------------------------------------------------- intent --

printf '\n## Description (the author'"'"'s stated intent — review against this)\n\n'
gh pr view "$PR" --json body --jq 'if (.body // "") == "" then "(no description)" else .body end'

printf '\n\n## Commits\n\n'
gh pr view "$PR" --json commits --jq '.commits[] | "- \(.oid[0:8])  \(.messageHeadline)"'

printf '\n## Files changed\n\n'
gh api "repos/{owner}/{repo}/pulls/$PR/files" --paginate \
  --jq '.[] | "- [\(.status)] +\(.additions)/-\(.deletions)  \(.filename)"'

# ------------------------------------------------------- prior conversation --

printf '\n## Prior review comments on THIS PR — already said, do not repeat\n\n'
inline="$(gh api "repos/{owner}/{repo}/pulls/$PR/comments" --paginate \
  --jq '.[] | "- \(.user.login) on \(.path):\(.line // .original_line // 0)\n  \(.body | gsub("\n"; "\n  "))"' 2>/dev/null || true)"
issue="$(gh api "repos/{owner}/{repo}/issues/$PR/comments" --paginate \
  --jq '.[] | "- \(.user.login) (top level)\n  \(.body | gsub("\n"; "\n  "))"' 2>/dev/null || true)"
reviews="$(gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --paginate \
  --jq '.[] | select((.body // "") != "") | "- \(.user.login) [\(.state)]\n  \(.body | gsub("\n"; "\n  "))"' 2>/dev/null || true)"

if [ -z "$inline$issue$reviews" ]; then
  printf '(none)\n'
else
  [ -n "$reviews" ] && printf '%s\n' "$reviews"
  [ -n "$inline" ] && printf '%s\n' "$inline"
  [ -n "$issue" ] && printf '%s\n' "$issue"
fi

# ------------------------------------------------------------- prior art -----
# Feedback these same files already attracted. A comment someone made on an
# earlier PR usually applies again — and repeating a lesson the team already
# learned is the fastest way to make a review feel worthless.

changed_files=()
while IFS= read -r f; do
  [ -n "$f" ] && changed_files+=("$f")
done <<EOF
$(pr_changed_files "$PR")
EOF

touched_file="$(mktemp -t pr-touched)"
# shellcheck disable=SC2064
trap "rm -f '$touched_file' '${diff_file:-}'" EXIT INT TERM
[ "${#changed_files[@]}" -gt 0 ] && printf '%s\n' "${changed_files[@]}" >"$touched_file"

if [ "$PRIOR_PRS" -gt 0 ] && [ "${#changed_files[@]}" -gt 0 ] && git rev-parse --git-dir >/dev/null 2>&1; then
  printf '\n## Feedback on earlier PRs that touched these same files\n\n'

  # --first-parent is load-bearing: PR numbers live in merge-commit subjects
  # ("Merge pull request #13 from ..."), and git's history simplification drops
  # those merges under a path filter. Walking first-parent keeps them, and also
  # catches the "(#13)" form that squash-merges leave behind.
  prior="$(git log --first-parent --format='%s' -n 200 -- "${changed_files[@]}" 2>/dev/null |
    grep -oE '#[0-9]+' | tr -d '#' |
    grep -vx "$PR" |
    awk '!seen[$0]++' | head -n "$PRIOR_PRS" || true)"

  if [ -z "$prior" ]; then
    printf '(no earlier PRs found in local history for these paths)\n'
  else
    printf 'These threads include their own resolutions. A point that was already\n'
    printf 'settled is closed — cite it only if this PR regresses it.\n\n'

    # Collect across every prior PR before ranking. Ranking inside each PR and
    # then capping starves the useful comments: on PR #25 the whole budget went
    # to the newest PR and the one comment on a file #25 actually changes landed
    # last, one slot from being cut.
    all=""
    for p in $prior; do
      one="$(gh api "repos/{owner}/{repo}/pulls/$p/comments" --paginate \
        --jq '.[] | "\(.path)\t\(.user.login)\t\(.body | gsub("\\s+"; " ") | .[0:300])"' 2>/dev/null |
        awk -v pr="$p" 'NF { print pr "\t" $0 }' || true)"
      [ -n "$one" ] && all="$all$one
"
    done

    if [ -z "$(printf '%s' "$all" | tr -d '[:space:]')" ]; then
      printf '(earlier PRs found: %s — none had inline review comments)\n' \
        "$(echo "$prior" | tr '\n' ' ')"
    else
      # Comments on files this PR also changes rank first. The rest are kept, not
      # dropped: on PR #25 the most useful prior comment sat on a file the PR
      # never touched, so filtering by path would have thrown away the best lead.
      ranked="$(printf '%s' "$all" | grep -v '^$' |
        awk -F'\t' 'NR==FNR { touched[$0] = 1; next }
          {
            if ($2 in touched) { pri = 0; mark = "  <-- this PR changes this file too" }
            else               { pri = 1; mark = "" }
            print pri "\t  - #" $1 " " $3 " on " $2 mark ": " $4
          }' "$touched_file" - |
        sort -s -k1,1n | cut -f2-)"

      total="$(printf '%s\n' "$ranked" | grep -c '^')"
      shown="$(printf '%s\n' "$ranked" | head -n "$PRIOR_COMMENTS")"
      marked="$(printf '%s\n' "$shown" | grep -c 'this PR changes this file too' || true)"

      printf 'Ranked across all of them, %s comment(s) on files this PR also\n' "$marked"
      printf 'changes come first and are marked.\n\n'
      printf '%s\n' "$shown"

      if [ "$total" -gt "$PRIOR_COMMENTS" ]; then
        printf '\n[showing %s of %s — raise PRIOR_COMMENTS for the rest]\n' \
          "$PRIOR_COMMENTS" "$total"
      fi
    fi
  fi
fi

# ---------------------------------------------------------------------- diff --

printf '\n## Diff\n\n'
diff_file="$(mktemp -t pr-context)"
# Re-arm with both temp files — a bare re-trap here would leak $touched_file.
# shellcheck disable=SC2064
trap "rm -f '$diff_file' '$touched_file'" EXIT INT TERM
gh pr diff "$PR" >"$diff_file"

total="$(wc -l <"$diff_file" | tr -d ' ')"
if [ "$total" -gt "$MAX_DIFF_LINES" ]; then
  head -n "$MAX_DIFF_LINES" "$diff_file"
  cat <<EOF

[truncated: showing $MAX_DIFF_LINES of $total diff lines]

This diff is large enough that reviewing it whole is unreliable. Pull the
remaining files one at a time instead of raising MAX_DIFF_LINES:

  gh api repos/{owner}/{repo}/pulls/$PR/files --paginate \\
    --jq '.[] | select(.filename == "PATH/HERE") | .patch'
EOF
else
  cat "$diff_file"
fi
