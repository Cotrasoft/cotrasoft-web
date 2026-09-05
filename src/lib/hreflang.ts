import { getAbsoluteLocaleUrl } from "astro:i18n";
import {
  DEFAULT_LOCALE,
  HREFLANG,
  SUPPORTED_LOCALES,
  type SupportedLang,
  X_DEFAULT,
} from "../consts";

export interface HreflangAlternate {
  readonly hreflang: string;
  readonly href: string;
}

// Per-locale path builder: most pages share one path across locales, while
// legal pages localize their slugs (`terminos` vs `terms`).
export type LocalizedPath = (locale: SupportedLang) => string;

// Single builder for every `<head>` alternate set (layouts + BaseHead
// fallback), so they cannot drift from each other: one entry per supported
// locale plus `x-default` pointing at the default-locale page.
export const localizedAlternates = (
  pathFor: LocalizedPath,
): readonly HreflangAlternate[] => [
  ...SUPPORTED_LOCALES.map(
    (locale): HreflangAlternate => ({
      hreflang: HREFLANG[locale],
      href: getAbsoluteLocaleUrl(locale, pathFor(locale)),
    }),
  ),
  {
    hreflang: X_DEFAULT,
    href: getAbsoluteLocaleUrl(DEFAULT_LOCALE, pathFor(DEFAULT_LOCALE)),
  },
];

// Shared-path pages (homepage): every locale resolves the same unprefixed
// pathname to its own prefixed URL.
export const pageAlternates = (path: string): readonly HreflangAlternate[] =>
  localizedAlternates((): string => path);

// Fallback for pages without explicit `alternates` (e.g. the Spanish-only
// blog): self-referential hreflang + x-default pointing at the current page,
// never fabricating prefixed URLs for routes that have no localized copy.
export const selfAlternates = (
  lang: SupportedLang,
  path: string,
): readonly HreflangAlternate[] => [
  { hreflang: HREFLANG[lang], href: getAbsoluteLocaleUrl(lang, path) },
  {
    hreflang: X_DEFAULT,
    href: getAbsoluteLocaleUrl(DEFAULT_LOCALE, path),
  },
];
