import {
  DEFAULT_LOCALE,
  HREFLANG,
  SUPPORTED_LOCALES,
  type SupportedLang,
  X_DEFAULT,
} from "../consts";
import { absoluteLocaleUrl } from "./locale-path";

export interface HreflangAlternate {
  readonly hreflang: string;
  readonly href: string;
}

// Per-locale path builder: most pages share one path across locales, while
// legal pages localize their slugs (`terminos` vs `terms`).
export type LocalizedPath = (locale: SupportedLang) => string;

// Relative-path spec shared by `<head>` alternates and the sitemap: one entry
// per supported locale plus `x-default` on the default-locale path. `path` is
// the unprefixed, locale-localized path (`/terms/` for `en`), so each consumer
// derives its URL form from the same table.
export interface AlternatePathSpec {
  readonly locale: SupportedLang;
  readonly lang: string;
  readonly path: string;
}

export const alternatePaths = (
  pathFor: LocalizedPath,
): readonly AlternatePathSpec[] => [
  ...SUPPORTED_LOCALES.map(
    (locale): AlternatePathSpec => ({
      locale,
      lang: HREFLANG[locale],
      path: pathFor(locale),
    }),
  ),
  { locale: DEFAULT_LOCALE, lang: X_DEFAULT, path: pathFor(DEFAULT_LOCALE) },
];

// Single builder for every `<head>` alternate set (layouts + BaseHead
// fallback), so they cannot drift from each other.
export const localizedAlternates = (
  pathFor: LocalizedPath,
): readonly HreflangAlternate[] =>
  alternatePaths(pathFor).map(
    ({ locale, lang, path }): HreflangAlternate => ({
      hreflang: lang,
      href: absoluteLocaleUrl(locale, path),
    }),
  );

// Shared-path pages (homepage): every locale resolves the same unprefixed
// pathname to its own prefixed URL.
export const pageAlternates = (path: string): readonly HreflangAlternate[] =>
  localizedAlternates(() => path);

// Fallback for pages without explicit `alternates` (e.g. the Spanish-only
// blog): both entries point at the page's own canonical URL — never at a
// prefixed counterpart that does not exist. `href` must be absolute; parsing
// keeps a relative value from silently emitting a relative hreflang.
export const selfAlternates = (
  lang: SupportedLang,
  href: string,
): readonly HreflangAlternate[] => {
  const absoluteHref: string = new URL(href).href;
  return [
    { hreflang: HREFLANG[lang], href: absoluteHref },
    { hreflang: X_DEFAULT, href: absoluteHref },
  ];
};
