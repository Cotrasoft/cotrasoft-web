import { DEFAULT_LOCALE, SITE_URL, type SupportedLang } from "../consts";

// Directory page paths only: no `//`, backslash or control characters, no
// query/hash, no `.`/`..` segments and no file extension. The WHATWG URL
// parser treats `\` as `/` for special schemes, strips embedded tab/newline
// and collapses dot segments, and Google requires alternate URLs to be fully
// qualified, so invalid input fails loudly instead of changing the origin or
// silently rewriting the path.
const PAGE_PATH_PATTERN = /^(?!.*\/\/)[^?#\\]*$/u;
const CONTROL_CHARACTER_PATTERN = /\p{Cc}/u;
const DOT_SEGMENT_PATTERN = /(?:^|\/)\.{1,2}(?:\/|$)/u;
const FILE_EXTENSION_PATTERN = /[^/]+\.[^/]+$/u;

const raiseInvalidPagePath = (path: string): never => {
  throw new Error(
    `Expected a directory page path without "//", "\\", "?" or "#", dot segments or a file extension: "${path}"`,
  );
};

const assertPagePath = (path: string): string =>
  PAGE_PATH_PATTERN.test(path) &&
  !CONTROL_CHARACTER_PATTERN.test(path) &&
  !DOT_SEGMENT_PATTERN.test(path) &&
  !FILE_EXTENSION_PATTERN.test(path)
    ? path
    : raiseInvalidPagePath(path);

// Astro 6.3.2 joins with a single leading slash and, with `trailingSlash:
// "ignore"` + `build.format: "directory"` (pinned in astro.config.mjs),
// appends a trailing one (`astro:i18n` `getLocaleRelativeUrl`). Normalize the
// same way so both helpers produce identical URLs for the same input.
const normalizePath = (path: string): string => {
  const withLeadingSlash: string = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

// Joins a locale onto an unprefixed path, mirroring
// `prefixDefaultLocale: false` in astro.config.mjs: the default locale stays
// prefix-less, every other locale is prefixed.
export const localePath = (locale: SupportedLang, path: string): string => {
  const normalized: string = normalizePath(assertPagePath(path));
  return locale === DEFAULT_LOCALE ? normalized : `/${locale}${normalized}`;
};

// Absolute counterpart of `localePath` for `<head>` URLs. Built on the same
// prefixing rule instead of `astro:i18n` so this module (and every consumer)
// stays pure and unit-testable outside an Astro build. Assumes `base` is not
// configured in `astro.config.mjs`, which is the case today.
export const absoluteLocaleUrl = (
  locale: SupportedLang,
  path: string,
): string => new URL(localePath(locale, path), SITE_URL).href;
