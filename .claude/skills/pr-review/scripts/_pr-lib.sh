# Shared helpers for the pr-review scripts. Source this, do not execute it.
#
# Everything here runs under bash (each script declares its own shebang), which
# matters: an interactive zsh treats `:s` in `$SHA:src/foo.ts` as a history
# modifier and either errors with "bad substitution" or — worse — silently
# resolves to something else. Keeping ref construction inside these scripts is
# what makes reading a PR's file tree reliable.

die() {
  printf '%s: %s\n' "${SCRIPT_NAME:-pr-review}" "$1" >&2
  exit 1
}

require_gh() {
  command -v gh >/dev/null 2>&1 || die "gh CLI not found — install it with: brew install gh"
  gh auth status >/dev/null 2>&1 || die "gh is not authenticated — run: gh auth login"
}

# Accepts a PR number, #number, a github URL (any host/owner/repo shape, with or
# without /files and #discussion anchors), a head branch name, or "current".
resolve_pr() {
  raw="${1#\#}"

  if [ "$raw" = "current" ] || [ "$raw" = "." ]; then
    n="$(gh pr view --json number --jq '.number' 2>/dev/null || true)"
    [ -n "$n" ] || die "the current branch has no open PR"
    printf '%s' "$n"
    return
  fi

  if printf '%s' "$raw" | grep -Eq '/pull/[0-9]+'; then
    printf '%s' "$raw" | sed -E 's#.*/pull/([0-9]+).*#\1#'
    return
  fi

  case "$raw" in
    *[!0-9]* | '') ;;
    *)
      printf '%s' "$raw"
      return
      ;;
  esac

  n="$(gh pr list --state all --head "$raw" --limit 1 --json number --jq '.[0].number // empty')"
  [ -n "$n" ] || die "could not resolve '$1' to a PR (tried number, URL, and head branch)"
  printf '%s' "$n"
}

# Echo the PR's head commit, fetching it first if it is not in the local object
# store. refs/pull/N/head always works on GitHub, whereas fetching a bare SHA is
# rejected by default.
pr_head_sha() {
  sha="$(gh pr view "$1" --json headRefOid --jq '.headRefOid' 2>/dev/null || true)"
  [ -n "$sha" ] || die "could not read the head SHA of PR #$1"

  if ! git cat-file -e "${sha}^{commit}" 2>/dev/null; then
    git fetch -q origin "refs/pull/$1/head" 2>/dev/null || true
  fi
  git cat-file -e "${sha}^{commit}" 2>/dev/null ||
    die "commit ${sha} for PR #$1 is not available locally and could not be fetched"

  printf '%s' "$sha"
}

# The files a PR changes, one per line.
pr_changed_files() {
  gh api "repos/{owner}/{repo}/pulls/$1/files" --paginate --jq '.[].filename'
}
