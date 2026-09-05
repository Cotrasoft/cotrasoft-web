# Architecture

## i18n model

This is the part most likely to trip you up.

- Locales are `es` (default) and `en`, with `prefixDefaultLocale: false`. Spanish lives at `/`, English at `/en/`.
- Because the default locale is un-prefixed, **`Astro.currentLocale` is `undefined` on Spanish routes**. Every locale-aware file resolves it through the single typed entry point:
  ```ts
  const lang = resolveLocale(Astro.currentLocale);
  ```
  `resolveLocale`, `DEFAULT_LOCALE` and `SupportedLang` live in `src/consts.ts` and must stay in sync with `astro.config.mjs` (`i18n.defaultLocale`, `i18n.locales`, and the `sitemap()` i18n block). Don't cast `Astro.currentLocale` by hand.
- **There is no central translation dictionary.** Each component owns its copy in a `defaults: Record<SupportedLang, T>` table in its frontmatter, plus an optional override prop. See `code-standards.md` for the authoring pattern.
- Longer prose is the exception: legal documents live in `src/lib/legal.ts` as a `Record<SupportedLang, LegalContent>`, with shared entity data (NIT, address, registration) factored into `ENTITY_VALUES`.
- Localized URL slugs are mapped in `legalSlugs` (`terminos`/`privacidad` vs `terms`/`privacy`). Route files pass the doc explicitly (`<Legal slug="terms" doc={legal.es.terms} />`), so both the slug map and the page file must be added per locale.
- Layouts don't build `hreflang` arrays by hand. `src/lib/hreflang.ts` is the single builder (`localizedAlternates`, `pageAlternates`, plus a `selfAlternates` fallback for pages without a localized copy such as the Spanish-only blog) over the `HREFLANG` / `SUPPORTED_LOCALES` / `X_DEFAULT` tables in `src/consts.ts`; layouts pass the result to `BaseHead`. `Navbar`/`Footer` use `getRelativeLocaleUrl` for the language switcher and internal links; hard-code nothing.
- `public/_redirects` 301s legacy `/es/*` URLs to the root.

Adding a locale means touching: `astro.config.mjs` (locales + sitemap), `SupportedLang`, every component's `defaults` table, the `HREFLANG` table (alternates derive from it), `legalSlugs`, and a new `src/pages/<locale>/` tree.

## Routing and content

- `src/pages/*.astro` = Spanish routes; `src/pages/en/*.astro` = English. Page files are deliberately thin — they pick a layout and pass locale-specific data.
- Layouts: `Home.astro` (landing), `Legal.astro` (terms/privacy), `BlogPost.astro`.
- The blog is **Spanish-only and not localized**: `src/pages/blog/`, `layouts/BlogPost.astro`, and `FormattedDate.astro` resolve to the default locale and emit no `en` hreflang (`BaseHead` falls back to self-referential alternates there).
- Blog posts are a content collection (`src/content.config.ts`) with a `published: boolean` (default `false`) gate. `src/lib/blog.ts` is the single accessor: it returns all posts during `astro dev` (`import.meta.env.DEV`) but only `published: true` posts in production builds, newest first. Use `getBlogPosts()` rather than calling `getCollection("blog")` directly, or drafts will leak into production and `rss.xml.ts` / the index / `getStaticPaths` will disagree.

## Styling system

Tailwind 4 via `@tailwindcss/vite` — **there is no `tailwind.config`**. All design tokens are declared in the `@theme` block of `src/styles/global.css`: the `--color-primary-*` ramp, `--gradient-primary`/`--gradient-hero`, `--font-sans` (wired to the Astro-managed `--font-inter`), and the `float`/`fade-up` keyframes.

Reusable classes live in `@layer components` in the same file: `.btn-primary`, `.btn-outlined`, `.btn-link`, `.glass-card`, `.gradient-text`, `.input-field`, `.section-padding`, `.card-hover`, `.reveal`.

`global.css` is imported exactly once, from `BaseHead.astro`.

`.reveal` fades in only when an element gains `is-visible`, which comes from the IntersectionObserver script inlined at the bottom of `layouts/Home.astro`. Using `.reveal` in a page that does not use that layout leaves the content permanently invisible. Reduced-motion fallbacks are already handled in CSS.

## Head, SEO, and fonts

- `BaseHead.astro` centralizes favicons/manifest, canonical URL, OG + Twitter tags, `og:locale` and its alternate, and the `hreflang` links passed in by the layout.
- Fonts come from Astro's fonts API (Google Inter, variable weight) configured in `astro.config.mjs`; `BaseHead` renders `<Font cssVariable="--font-inter" preload />`.
- Sitemap and RSS are generated (`@astrojs/sitemap` with `serializeSitemapItem` from `src/lib/sitemap.ts` for legal hreflang pairing, `src/pages/rss.xml.ts`).

## Known rough edges

Real state of the repo — don't mistake these for intentional patterns:

- `FaqJsonLd` in `src/components/seo/` is written but referenced by nothing — deliberately, since no FAQ section exists yet and markup must match visible content. The other three (`OrganizationJsonLd`, `WebsiteJsonLd`, `ServicesJsonLd`) are wired from `layouts/Home.astro` and emit on both homes.
- `FormattedDate.astro` formats with `en-us` even on Spanish pages.
- Leftovers from the Astro blog starter, **not** real content: `README.md`, `src/pages/about.astro` (lorem ipsum), `first-post.md`, `second-post.md`, `third-post.md`, `markdown-style-guide.md`, `using-mdx.mdx`, and the `blog-placeholder-*.jpg` assets. `dos-anos-cotrasoft.md` is the only genuine post.
