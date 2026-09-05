# Code standards

## Biome

Biome is the only formatter and linter, and it only inspects `./src`. Config: 2-space indent, double quotes, organize-imports on, `recommended` rules plus an explicit `style` block.

The `overrides` block disables `useConst`, `useImportType`, `noUnusedVariables`, and `noUnusedImports` for `.astro`/`.jsx`/`.tsx` because Biome misreads Astro frontmatter. **Don't "fix" apparent violations of those four rules in those files** — the exemption is deliberate.

`biome ci ./src` must pass before pushing (enforced by `.githooks/pre-push`).

## TypeScript

`astro/tsconfigs/strict` with `strictNullChecks`, and `jsx: react-jsx` (React 19 is installed via `@astrojs/react` for future islands; nothing uses it yet). **Nothing type-checks this repo** — `astro build` strips types without checking them, and `astro check` is unavailable. Type errors surface only in the editor, so a green `pnpm build` says nothing about them.

`Astro.site` and `context.site` are `URL | undefined`. `site` *is* set in `astro.config.mjs`, so at build time they are never actually undefined — but do not silence the type, because the failure is real rather than cosmetic: `new URL(path, undefined)` throws instead of degrading, and TS waves it through since the `base` argument is optional.

Prefer a fallback to the typed `SITE_URL` constant in `src/consts.ts` over an assertion — `Astro.site ?? SITE_URL` (or `site ?? SITE_URL` in an endpoint). It satisfies the type without lying about it and still yields a working URL if `site` is ever unset. `src/components/seo/*JsonLd.astro` still use `Astro.site!`; those are the files left to migrate, not the pattern to copy. (`SITE_URL` arrives with the sc-150 stack — add it if it is not there yet.)

## Localized component pattern

Every locale-aware component follows the same shape. Match it rather than inventing a new one:

```astro
---
import { resolveLocale } from "../consts";

interface HeroLabels { heading: string; /* ... */ }
interface Props { labels?: Partial<HeroLabels> }

const { labels = {} } = Astro.props;
const lang = resolveLocale(Astro.currentLocale);

const defaults: Record<SupportedLang, HeroLabels> = {
  es: { heading: "…" },
  en: { heading: "…" },
};

const t: HeroLabels = { ...defaults[lang], ...labels };
---
```

- The prop is named `labels` for short UI strings (`Hero`, `Navbar`, `Footer`) and `content` for structured section copy (`Services`, `Benefits`).
- The merge is **shallow** — nested objects (`stats`, `links`, `contact`) are spread one extra level by hand. Keep that explicit if you add nesting.
- `Record<SupportedLang, T>` is intentional: adding a locale to `SupportedLang` makes every incomplete `defaults` table a type error, which is the safety net.
- To change user-visible copy, edit the component that renders it. Don't introduce a central i18n dictionary without agreeing on the migration first.
- Exception: `Services` copy lives in `src/lib/services.ts`, not in the component, because the JSON-LD in `layouts/Home.astro` must read the same data the cards render. Same reasoning as `src/lib/legal.ts`.

## Styling

Use the existing tokens and `@layer components` classes from `src/styles/global.css` (`.btn-primary`, `.gradient-text`, `.section-padding`, …) instead of re-deriving the same utility chains inline. Add a new class there when a pattern repeats. Reference colors through the `primary` ramp (`text-primary`, `bg-primary-800`), never raw hex.

Dark mode is class-driven via Tailwind's `dark:` variants on every surface — a new section needs both light and dark treatments.

## Icons

Icons are an inline-SVG registry, not a package. Adding one means **two** files:

1. the `IconName` union in `src/components/icons.ts`
2. a matching `{name === '…' && (…)}` block in `src/components/Icon.astro`

`Icon` renders `aria-hidden` unless given an `aria-label` (which also sets `role="img"`).

## Interactive behavior

Client behavior is plain inline `<script>` at the bottom of the component or layout that owns it (see `Navbar.astro`'s mobile menu, `Home.astro`'s reveal observer), driven by `data-*` hooks and ARIA state (`aria-expanded`, `data-open`) that CSS reacts to. No client framework is in use — keep it that way unless there's a reason to hydrate an island.

## Misc

- `cspell.json` carries a project word list (Spanish + tooling terms); add new domain words there rather than rewording copy.
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `refactor:`, `style:`).
