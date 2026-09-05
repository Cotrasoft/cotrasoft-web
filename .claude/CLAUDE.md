# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Detailed guidance lives in `.claude/rules/`, which Claude Code loads automatically alongside this file:

- `architecture.md` — i18n model, routing, content collections, styling system, deploy target
- `code-standards.md` — Biome config quirks, component authoring patterns, conventions

## Project

Static marketing site for Cotrasoft, a Colombian software developers' cooperative (`cotrasoft.co`). Astro 6 + Tailwind 4, `output: "static"`, deployed as Cloudflare Workers static assets. The member-facing transactional app lives elsewhere (`app.cotrasoft.co`) and is only linked to.

Requires Node >= 22.12 and pnpm 10 (`packageManager` is pinned).

## Commands

```sh
pnpm install          # also sets core.hooksPath to .githooks (prepare script)
pnpm dev              # dev server on localhost:4321
pnpm build            # production build to ./dist
pnpm preview          # preview the built site
pnpm lint             # biome check --write ./src  (fixes)
pnpm format           # biome format --write ./src
pnpm exec biome ci ./src   # non-mutating check — exactly what CI and the pre-push hook run
pnpm cf:preview       # wrangler dev against ./dist
pnpm cf:prod          # wrangler deploy
```

## Verification

Unit tests live under `src/` and run with `pnpm test` (vitest, scoped by `vitest.config.ts` — e2e specs under `e2e/` run separately with `pnpm test:e2e`). There is no type-check script — `@astrojs/check` and `typescript` are not dependencies, so `astro check` is unavailable. The gates are:

1. `pnpm exec biome ci ./src`
2. `pnpm test`
3. `pnpm build`

Run both before claiming work is done. `.githooks/pre-push` runs the first, so a green push means green lint CI.

## CI/CD

- PRs: Biome check + `pnpm build` on Node 22 and 24.
- Push to `main`: build, then `wrangler deploy` via `cloudflare/wrangler-action` (`.github/workflows/deploy.yml`).
- `wrangler.jsonc` serves `./dist` as static assets. `cf:staging` runs `wrangler deploy --env staging`, but there is no `env.staging` block in `wrangler.jsonc` — that script has nothing to target today.
- Dependabot is configured for npm (daily, grouped patch/minor, majors ignored) and GitHub Actions (weekly).
