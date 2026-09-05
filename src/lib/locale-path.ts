import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLang,
} from "../consts";

// Locales that appear as a URL prefix. `prefixDefaultLocale: false` keeps the
// default locale prefix-less, so only these can ever prefix a pathname.
const PREFIXED_LOCALES: readonly string[] = SUPPORTED_LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

const PREFIX_PATTERN = new RegExp(
  `^/(?:${PREFIXED_LOCALES.join("|")})(?=/|$)`,
  "u",
);

// `getAbsoluteLocaleUrl` joins locale + path verbatim (Astro never strips an
// existing prefix), so feeding it a prefixed pathname doubles the prefix
// (`/en/en/terms/`). Strip it first; the result always starts with `/`.
export const stripLocalePrefix = (pathname: string): string =>
  pathname.replace(PREFIX_PATTERN, "") || "/";

// Joins a locale onto an unprefixed path, mirroring
// `prefixDefaultLocale: false` in astro.config.mjs: the default locale stays
// prefix-less, every other locale is prefixed.
export const localePath = (locale: SupportedLang, path: string): string =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
