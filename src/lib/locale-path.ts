import { DEFAULT_LOCALE, SITE_URL, type SupportedLang } from "../consts";

// The WHATWG URL parser treats `\` as `/`, strips embedded tab/newline and
// collapses dot segments, so an unvalidated path can silently change the
// origin. Reject instead: hreflang URLs must be exactly what we intend.
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

// Matches `astro:i18n` under `trailingSlash: "ignore"` + directory format.
const normalizePath = (path: string): string => {
  const withLeadingSlash: string = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

// Mirrors `prefixDefaultLocale: false` in astro.config.mjs.
export const localePath = (locale: SupportedLang, path: string): string => {
  const normalized: string = normalizePath(assertPagePath(path));
  return locale === DEFAULT_LOCALE ? normalized : `/${locale}${normalized}`;
};

// Avoids `astro:i18n` so this module stays unit-testable outside a build.
// Assumes `base` is unset in astro.config.mjs, which holds today.
export const absoluteLocaleUrl = (
  locale: SupportedLang,
  path: string,
): string => new URL(localePath(locale, path), SITE_URL).href;
