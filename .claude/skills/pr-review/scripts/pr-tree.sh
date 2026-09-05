#!/usr/bin/env bash
#
# Read the PR's file tree instead of your working directory.
#
# This exists because the working directory is almost never the PR. Reviewing
# from `main` while reasoning about a branch produces findings that are
# confidently wrong — grep for a symbol, get "no references", report dead code,
# and be flatly mistaken because the references live on the branch.
#
#   pr-tree.sh 25 read src/layouts/Home.astro     # the file as the PR has it
#   pr-tree.sh 25 read src/consts.ts src/lib/legal.ts src/layouts/Legal.astro
#   pr-tree.sh 25 grep 'OrganizationJsonLd'       # search the PR's whole tree
#   pr-tree.sh 25 grep 'defaults' 'src/**/*.astro'  # ...or a pathspec subset
#   pr-tree.sh 25 ls src/lib                      # what exists on the branch
#
#   pr-tree.sh --sha 54ceab0 read src/consts.ts   # pinned: no network, ~40x faster
#
# Inside a review, prefer `--sha` with the head sha from pr-context.sh. It skips
# both `gh` round-trips, and more importantly it pins every call to one tree: with
# a PR number the head is re-resolved per invocation, so an author force-pushing
# mid-review silently splits your reading across two commits. Re-run pr-context.sh
# before publishing to confirm the head has not moved.
#
# `read` takes as many paths as you want, and that is the main lever on call
# count: one invocation reading six files costs what one file costs. Prefer
# over-fetching the neighbourhood of a diff to discovering you need a seventh
# file two calls later.
#
# With one path, stdout is exactly the file and the SHA goes to stderr, so the
# SHA is there for a permalink without contaminating a pipe. With several, stdout
# is a bundle, so each file gets a `===== path =====` marker on stdout — an
# unmarked concatenation is unreadable. A path that does not exist never aborts
# the run: every file that does exist still prints, and the missing ones are
# listed together at the end.
#
set -euo pipefail

SCRIPT_NAME=pr-tree
# shellcheck source=_pr-lib.sh
. "$(cd "$(dirname "$0")" && pwd)/_pr-lib.sh"

usage() {
  sed -n '3,34p' "$0" | sed 's/^#\{1,2\} \{0,1\}//'
  exit "${1:-1}"
}

[ "$#" -ge 2 ] || usage
case "${1:-}" in -h | --help | '') usage 0 ;; esac

git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository"

# Two ways in, and the pinned one is strictly better inside a review.
#
# read/grep/ls are pure git operations, so supplying the SHA means never touching
# the network: measured on this repo, resolving a PR number costs `gh auth status`
# (0.87s) plus `gh pr view` (0.58s) to perform 0.03s of actual work.
#
# Pinning also closes a correctness hole. Resolving the head on every invocation
# means an author force-pushing mid-review silently splits your reading across two
# different trees — and on a stacked repo like this one the head does move: #21
# went from d05a012 to 54ceab0 between two days of the same review. Resolve once
# from pr-context.sh, then pass that SHA to every call.
if [ "${1:-}" = "--sha" ]; then
  [ "$#" -ge 3 ] || die "--sha needs a sha and a mode: pr-tree.sh --sha <sha> read <path>"
  SHA="$(git rev-parse --verify --quiet "${2}^{commit}")" ||
    die "commit '$2' is not in the local object store — run 'pr-context.sh <pr>' first, which fetches it"
  WHERE="pinned"
  HINT="--sha $2"
  shift 2
  MODE="$1"
  shift
else
  require_gh
  PR="$(resolve_pr "$1")"
  shift
  MODE="$1"
  shift
  SHA="$(pr_head_sha "$PR")"
  WHERE="PR #$PR"
  HINT="$PR"
fi

case "$MODE" in
  read)
    [ "$#" -ge 1 ] || die "read needs a path: pr-tree.sh $HINT read <path> [more...]"

    if [ "$#" -eq 1 ]; then
      printf '%s at %s (%s)\n' "$1" "${SHA:0:12}" "$WHERE" >&2
    else
      printf '%s files at %s (%s)\n' "$#" "${SHA:0:12}" "$WHERE" >&2
    fi

    # Newline-delimited string rather than an array: macOS ships bash 3.2, where
    # "${empty[@]}" under `set -u` is an error, not an empty expansion.
    missing=''
    for path in "$@"; do
      if git cat-file -e "${SHA}:${path}" 2>/dev/null; then
        # Only mark up stdout when it is a bundle, so a single read stays pipeable.
        if [ "$#" -gt 1 ]; then
          printf '\n===== %s =====\n' "$path"
        fi
        git show "${SHA}:${path}"
      else
        missing="${missing}${path}
"
      fi
    done

    # Reported last, so a bad path costs nothing that the good ones already
    # printed and one call names every path that was wrong.
    if [ -n "$missing" ]; then
      die "does not exist at ${SHA:0:12}: $(printf '%s' "$missing" | tr '\n' ' ')— check 'pr-tree.sh $HINT ls' for the real paths"
    fi
    ;;

  grep)
    [ "$#" -ge 1 ] || die "grep needs a pattern: pr-tree.sh $HINT grep <pattern> [pathspec...]"
    pattern="$1"
    shift
    # Strip the "<sha>:" prefix git prepends so the output reads as path:line,
    # which is what a finding needs to cite.
    if [ "$#" -gt 0 ]; then
      git grep -n -E "$pattern" "$SHA" -- "$@" | sed "s|^${SHA}:||" ||
        die "no match for '$pattern' at ${SHA:0:12} under: $*"
    else
      git grep -n -E "$pattern" "$SHA" | sed "s|^${SHA}:||" ||
        die "no match for '$pattern' anywhere at ${SHA:0:12}"
    fi
    ;;

  ls)
    if [ "$#" -gt 0 ]; then
      git ls-tree -r --name-only "$SHA" -- "$@"
    else
      git ls-tree -r --name-only "$SHA"
    fi
    ;;

  *)
    die "unknown mode '$MODE' — expected read, grep, or ls"
    ;;
esac
