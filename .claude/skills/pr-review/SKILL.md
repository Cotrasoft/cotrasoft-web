---
name: pr-review
description: Use when reviewing a pull request in this repository — the user says "revisá el PR", "code review", "review PR 25", pastes a github.com/Cotrasoft/cotrasoft-web/pull/N link, names a branch to review, asks which open PRs still need review, or asks whether a branch is safe to merge. Use it before approving or merging anything, Dependabot bumps included, and when the user says a review finding should become a project rule.
---

# PR review

## Core principle

A review earns its keep only if every finding is true. The failure mode that
matters here is not the missed nit — it is the confident false positive, because
it costs the author real time and teaches them to skim your next review. So the
bar for each finding is: **you can point at a `file:line` you actually opened,
and you tried to disprove it first.**

Under-report rather than pad. Three findings the author acts on beat twelve they
argue with.

## Scripts

All live in `.claude/skills/pr-review/scripts/` and expect an authenticated `gh`.

| Command | Use |
|---|---|
| `pr-context.sh` | No target yet — lists open PRs and stops |
| `pr-context.sh <number \| #id \| url \| branch \| current>` | Everything about one PR in a single call: metadata + head SHA, eligibility flags, description, commits, file list, comments already on this PR, prior feedback these files attracted, full diff |
| `pr-tree.sh <pr> read <path>…` | The file **as the PR has it**. Takes any number of paths in one call — the main lever on call count |
| `pr-tree.sh --sha <sha> <mode>…` | The same three modes pinned to one commit, with no `gh` round-trip. Use this for every call inside a review |
| `pr-tree.sh <pr> grep <regex> [pathspec…]` | Search the PR's whole tree; prints `path:line` |
| `pr-tree.sh <pr> ls [pathspec]` | What exists on the branch |
| `pr-stack.py <pr> [--grep REGEX]` | Where the PR sits in the stack, and whether another PR in the chain already handles something |
| `post-review.py --pr N --body FILE [--comments FILE] [--dry-run]` | Publish. Validates every inline comment against the real diff hunks and folds unanchorable ones into the summary so nothing is lost. `--dry-run` first. |

**Your working directory is not the PR.** It is usually `main`. Grepping `src/`
to reason about a branch is the single most expensive mistake available here: you
search for a symbol, get no hits, report dead code, and are flatly wrong because
the references live on the branch. Every question about the PR's file contents
goes through `pr-tree.sh`.

Reach for these instead of hand-rolling `gh` and `git` chains. Beyond saving
calls, `git show "$SHA:path"` typed at an interactive zsh prompt is actively
unsafe — zsh reads the `:s` as a history modifier and either errors with
`bad substitution` or silently resolves to something else, which is how a review
ends up describing a file it never read. The scripts run under bash and build
refs safely.

Batch the reads. `read` takes many paths at once, so pull the whole neighbourhood
of a diff — the sibling locale file, the second half of the registry, the layout
the page chose — in one call rather than discovering you need a seventh file two
calls later. One call reading six files costs what one file costs.

Then pin the SHA. `pr-context.sh` prints the `head sha`; pass it to every
subsequent call as `--sha <sha>` instead of the PR number. Two reasons, and the
second is the real one:

- Speed. `--sha` needs no network at all. Measured here, six files went from
  6.65s (six invocations, each re-resolving the head over `gh`) to 0.13s.
- **Correctness.** With a PR number the head is re-resolved on every invocation,
  so an author force-pushing mid-review silently splits your reading across two
  commits — early findings describing one tree, later ones another, with nothing
  in the output to tell you. This is not theoretical: #21's head moved three times
  across three days of one review (`d05a012` → `54ceab0` → `6e93bfa`).

The flip side of pinning is that a stale SHA stays stale, so **re-run
`pr-context.sh` before publishing** and confirm the head still matches what you
reviewed. If it moved, review the new commits before posting — findings the author
already fixed are the fastest way to make a review worthless.

### The LSP tool answers about your working tree, not the PR

`findReferences`, `hover` and `goToDefinition` index whatever is checked out.
Asking "who references `SITE_TITLE`?" from `main` returns a precise, authoritative
answer *about `main`* — the same wrong-tree error as grepping `src/`, except a
grep's silence makes you doubt it while an LSP's two exact hits do not. Do not use
LSP to reason about a PR unless the PR's head is what is checked out.

Two further limits here, both of which manufacture false "unused" findings:

- The `typescript-lsp` plugin covers `.ts .tsx .js .jsx` only, and `src/` is ~25
  `.astro` files to ~5 `.ts`. Measured on this repo: `findReferences` on
  `SITE_TITLE` reported **3 references in 2 files**, silently omitting
  `BaseHead.astro` and `Home.astro`, where it is genuinely used — half the real
  call sites, with no indication anything was skipped. Never conclude "unused"
  or "dead code" from an LSP result here; confirm with `pr-tree.sh grep`.
- The server needs `typescript` resolvable in the workspace. Installing the
  language-server binary is not enough, so LSP may fail to initialize entirely.

### Worktrees are for running the gates, not for reading

Opt-in, never routine. Reading through a worktree costs *more* calls, not fewer:
one `pr-tree.sh read` takes many paths, while `Read` takes one file per call.

Create one only when a finding needs a gate actually run:

```sh
git fetch -q origin "refs/pull/<pr>/head"
git worktree add /tmp/pr-<pr> <head-sha>   # the head sha from pr-context.sh
```

That buys the right to say "the build fails" instead of "the diff suggests", and
it is the only way to make LSP safe. If you run the gates, say so in the report
and name the SHA you ran them on. Remove the worktree when you are done.

## Workflow

### 1. Pick the target

Run `pr-context.sh` with whatever the user gave you. With no argument it lists
the open PRs — show that list and ask which one, rather than guessing.

If the work is not a PR yet (local branch, uncommitted changes), review
`git diff $(git merge-base HEAD origin/main)...HEAD` instead. With no PR there is
no stack, no prior thread and nothing to publish, so steps 3, 6 and 9 do not
apply — and here the working tree *is* the thing under review, so read it
directly rather than through `pr-tree.sh`.

### 2. Read the eligibility block before spending a review

`pr-context.sh` opens with an `## Eligibility` section flagging four cheap
reasons the job may not be what you assume: the PR is closed or merged, it is a
draft, a bot opened it, or you already reviewed it. None is an automatic stop,
but each changes the work — a draft may not be asking yet, and a PR you already
reviewed needs only its new commits examined, not a second full pass. Say which
one applies and let the user redirect you, rather than silently running the
wrong review.

### 3. Place the PR in the stack

Run `pr-stack.py <pr>`. This repo stacks deep — `main → #25 → #26 → #21 → #18 →
#24 → #19` was a real chain — and position decides what a finding *means*:

- An **ancestor** supplies things. "X is missing" is wrong when the parent adds X,
  and the diff you were handed is against the PR's real base, not `main`.
- A **descendant** may already fix things. Then it is not a code defect but a
  merge-ordering constraint — a different ask, and a different severity.

When a finding hinges on that, `pr-stack.py <pr> --grep SYMBOL` searches every
other PR in the chain in one call. Do not sample the stack by hand: on #25,
checking only the two obvious neighbours missed that #19 also touched the same
component.

### 4. Load the rulebook

`CLAUDE.md`, `.claude/rules/architecture.md` and `.claude/rules/code-standards.md`
are the authority on what this project considers correct. Claude Code loads them
automatically, but re-read them if you are in a subagent or unsure — and let them
override anything in this file.

A finding must trace to one of: a documented rule, a genuine defect, or a
security/accessibility/SEO problem. If it traces to none of those, it is your
taste, not a finding — drop it or ask it as a question.

### 5. Derive the checks from what the diff touches

Do not read the diff top to bottom looking for trouble. Look at *which* files
changed, ask what the rulebook says about that area, and turn it into a check
you can run. This is where the review's value comes from, because most real
defects here are a convention half-applied — the change looks fine in isolation
and is wrong in context.

The table below is a **derived index, not the authority.** If it disagrees with
`.claude/rules/`, the rules win and the table needs fixing.

| The diff touches | The rulebook says | So check |
|---|---|---|
| `src/components/icons.ts` | icons are a two-file registry | `Icon.astro` gained the matching `{name === '…'}` block, and vice versa |
| a `defaults: Record<SupportedLang, T>` table | every locale needs an entry | `es` **and** `en` are present, and `en` is not Spanish copy-pasted |
| `Astro.currentLocale` | it is `undefined` on Spanish routes | it resolves as `?? DEFAULT_LOCALE` |
| a new page in `src/pages/` | layouts build the hreflang alternates | it uses a layout that emits alternates, or adds them itself |
| `.reveal` | it only animates under the `Home` layout | the page rendering it actually uses `Home.astro`, or the content is invisible |
| `getCollection("blog")` | `getBlogPosts()` is the only accessor | the `published` gate is not bypassed |
| repeated utility chains | `@layer components` already has the class | `.btn-primary` / `.section-padding` / `.glass-card` are not re-derived by hand |
| a new color or surface | reference the `primary` ramp | no raw hex, and a `dark:` treatment exists |
| `astro.config.mjs` i18n or `SupportedLang` | they must stay in sync | both changed together, plus the `sitemap()` i18n block |
| a new legal route | `legalSlugs` + one page file per locale | both locales were added, not just one |
| user-visible copy | `cspell.json` carries the word list | new domain words were added there rather than the copy reworded |

Then **open the files around the diff, on the branch** — `pr-tree.sh <pr> read`
and `pr-tree.sh <pr> grep`. A diff hides the context that makes a change wrong:
the sibling locale entry that was not updated, the second half of a two-file
registry, the layout the new page chose. One `pr-tree.sh grep` across the tree
usually answers a whole row of the table above, with the `path:line` a finding
needs to cite.

### 6. Check what these files already taught the team

`pr-context.sh` mines the earlier PRs that touched these same paths and shows the
review comments they attracted. Read it — a lesson the team already learned is
the highest-value thing you can carry forward, and re-raising one someone
already answered is the fastest way to make a review feel worthless.

Two distinct uses, and the second is where it goes wrong:

- **A past comment that still applies.** If a reviewer asked for something
  general — "ensure this is not only in home but in all pages" — and this PR
  does the narrow version, that is a finding, and citing the earlier PR makes it
  land without an argument.
- **A past comment that was resolved.** Those threads include the author's
  answer. If `_redirects` on Workers was questioned and then verified to work,
  it is settled. Raise it again only if this PR regresses it. Reading the
  question and skipping the answer manufactures a false positive out of history.

### 7. Falsify each candidate before it becomes a finding

For every suspicion, run the cheapest check that would prove you wrong — grep
the symbol, open the other file, read the layout. Findings that survive get
reported with the `file:line` you verified. Findings you could not confirm get
downgraded to a `[pregunta]` or dropped.

This skill does not build or lint the branch, so **never assert that the PR
fails the build, breaks types, or violates lint.** Say what you observed in the
diff and let CI report on CI's behalf. "`SupportedLang` gains a locale but
`Footer.astro`'s table has no `en` key" is a finding; "this will not compile" is
a claim you did not earn.

### 8. Report

Match the language the user is writing to you in. Use this shape:

```
## Review: PR #<n> — <title>
<author> · <head> → <base> · +<A>/-<D> in <F> files

**Veredicto:** <listo para merge | cambios requeridos | bloqueado> — <the single most important reason>

### Hallazgos

#### [bloqueante] <one-line title>
`<path>:<line>`
<What is wrong. Why it matters here. The concrete change that fixes it.>

### Revisado sin hallazgos
- <a check you derived in step 4> — <how you confirmed it>

### Fuera de alcance
- <something real you noticed that does not belong to this PR>
```

Order findings worst first. `Revisado sin hallazgos` is what tells the author
your silence means "I looked", so list the checks from step 4 that came back
clean — not a generic checklist you did not run. Drop any section that is empty
rather than writing "none".

### 9. Offer to publish — never publish unprompted

Publishing is outward-facing and visible to the whole team, so it needs an
explicit yes for **this** review. A yes on a previous PR does not carry over.

Show the report, then offer it. On confirmation, **first re-run `pr-context.sh` and
check the head sha against the one you reviewed.** If it moved, read the new
commits before posting — a finding the author already fixed costs them more trust
than the finding was worth. Then write the summary to a file and the inline
findings to a JSON array (`[{path, line, body}]`), run `post-review.py --dry-run`
first, then post. Default `--event COMMENT`; `REQUEST_CHANGES` and `APPROVE` only
when the user asks for that verdict.

A published review has a different audience than the report, so it takes its
language from the team rather than from the conversation: match the language of
the PR body and the prior review comments, which `pr-context.sh` already showed
you. On this repo that is English even when the conversation is in Spanish.
Say so when you offer to publish, so nobody is surprised by the switch.

If the user's yes covered several requests at once, publishing is the one to
confirm separately — a public comment on someone else's PR is not the place to
resolve an ambiguous "sure".

When the summary body needs to cite code, a bare `file:line` is not clickable in
a GitHub comment. Use a permalink built on the `head sha` from the metadata
block, centred on the line with a line of context either side:

```
https://github.com/Cotrasoft/cotrasoft-web/blob/<full-head-sha>/src/consts.ts#L11-L14
```

The full 40-character SHA is required. A comment is rendered as static markdown,
so `$(git rev-parse HEAD)` and other shell substitutions arrive literally and
produce a dead link — paste the SHA itself. Branch names go stale the moment the
author pushes again, which is why the SHA and not `main` or the head ref.

### 10. Propose a rulebook update — only when it generalizes

A finding earns a rule when it would recur on a different PR by a different
author. One-off mistakes do not; if you cannot name the next PR that would trip
on it, skip this step entirely and say nothing.

When it does earn one, decide which doc owns it: `.claude/rules/architecture.md`
for how the system fits together, `.claude/rules/code-standards.md` for how code
should be written. Show the exact text you would add and where, then wait for a
yes. Keep it to the shortest form that would have prevented the finding, in the
voice of the surrounding doc.

## Severity

| Label | Meaning |
|---|---|
| `[bloqueante]` | Ships a defect, breaks a locale, leaks a draft, or violates a documented rule. Do not merge. |
| `[importante]` | Real problem, not a merge-stopper on its own. Fix now or file it. |
| `[nit]` | Small and optional. The author may decline without discussion. |
| `[pregunta]` | You suspect a problem but could not confirm it. Ask; do not assert. |

If everything is a nit, say the PR is fine and stop. Padding a clean PR to look
thorough is the sycophantic failure mode in reverse.

## What not to flag

Signal dies fastest from findings that were never the author's job.

- **The four Biome-exempt rules** — `useConst`, `useImportType`,
  `noUnusedVariables`, `noUnusedImports` in `.astro` / `.jsx` / `.tsx`. Biome
  misreads Astro frontmatter; the exemption in `biome.json` is deliberate.
- **Anything `pnpm lint` fixes** — quote style, indentation, import order.
  Formatting is a tool's job, not a reviewer's.
- **Missing tests.** There is no test suite and no `astro check`. Asking for
  tests asks for infrastructure that does not exist.
- **Lint rules outside `./src`.** Biome only inspects `./src` and ignores
  `dist`, `node_modules`, `.astro` and `public`. Do not cite style rules
  against `public/robots.txt` or `_redirects`.
- **The known rough edges** listed in `architecture.md` — the unreferenced
  JSON-LD components, `FormattedDate`'s `en-us` formatting, the Astro starter
  leftovers. They are already documented. Only raise one if this PR touches it.
- **Style preferences the rulebook is silent on.** At most a `[pregunta]`.

## Dependency PRs

Dependabot PRs (grouped patch/minor; majors are ignored by config) get a
different lens: read what actually changed in the lockfile diff, confirm the
bumps are the ones the title claims, and check that a grouped bump did not
smuggle in a range change to `package.json`. Never hand-edit a lockfile. For
anything beyond a patch bump, the changelog is the review — semver is a promise
the maintainer may not have kept.

## Environment traps

These each cost real calls on this skill's first run, and none is guessable:

- **macOS ships BSD coreutils.** `cat -A` does not exist, and `sed` will not
  evaluate `$((…))` in a replacement. When a one-liner starts needing arithmetic
  or GNU-only flags, switch to `python3` rather than escalating shell cleverness.
- **zsh treats `:` after a variable as a modifier.** `$SHA:src/foo.ts` becomes a
  history substitution. `${SHA}:src/foo.ts` is safe, but the scripts already
  handle refs — that is the point of them.
- **A literal backslash-u escape does not survive being written to a file.** If a
  finding concerns unicode escaping, describe it in words rather than
  reproducing the sequence. When the exact bytes matter, assemble the string in
  `python3` using `chr(92)` for the backslash.

## Red flags — stop and redo the step

- About to write "this breaks the build" → you did not run the build. Rewrite as
  what you observed in the diff.
- About to report a finding you have not opened the file for → open it or drop it.
- Grepping `src/` or reading a file with Read to reason about the PR → that is
  your working tree, not the branch. Use `pr-tree.sh`.
- Running an LSP query to reason about the PR → it indexes the checked-out tree,
  and it will answer about the wrong one with total confidence. Only valid with
  the PR's head checked out, and never as evidence that a symbol is unused.
- Reading files one per call → `read` takes many paths. Batch them.
- Passing a PR number to `pr-tree.sh` after the first call → pin `--sha` instead,
  or a mid-review force-push splits your reading across two trees.
- About to publish without re-checking the head sha → the PR may have moved since
  you read it.
- A grep came back empty and the conclusion is "unused" or "dead code" → confirm
  you searched the PR's tree, not `main`. This is the most common way to be
  confidently wrong here.
- About to run `post-review.py` without an explicit yes for this PR → stop.
- Flagging a missing piece on a stacked PR → check the parent branch first.
- Repeating a point from an earlier PR → read the reply underneath it; it was
  probably answered.
- Adding a rule to `.claude/rules/` after a single one-off mistake → it does not
  generalize. Leave the docs alone.
- Report is a long list of nits with no verdict → lead with the verdict, cut the nits.
