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

// Legal pages localize their slugs (`terminos` vs `terms`); most pages don't.
export type LocalizedPath = (locale: SupportedLang) => string;

// Shared by `<head>` alternates and the sitemap, which need different URL
// forms of the same set. `path` is unprefixed (`/terms/` for `en`).
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

export const localizedAlternates = (
  pathFor: LocalizedPath,
): readonly HreflangAlternate[] =>
  alternatePaths(pathFor).map(
    ({ locale, lang, path }): HreflangAlternate => ({
      hreflang: lang,
      href: absoluteLocaleUrl(locale, path),
    }),
  );

export const pageAlternates = (path: string): readonly HreflangAlternate[] =>
  localizedAlternates(() => path);

// For pages with no localized copy: point at themselves, never at a prefixed
// counterpart that does not exist. `new URL` rejects a relative `href`, which
// would otherwise emit a relative hreflang.
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
