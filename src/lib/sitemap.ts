import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import { DEFAULT_LOCALE, HREFLANG, X_DEFAULT } from "../consts";
import { alternatePaths } from "./hreflang";
import { LEGAL_SLUGS, type LegalSlug, legalSlugs } from "./legal";
import { localePath } from "./locale-path";

interface AlternatePath {
  lang: string;
  path: string;
}

// Sitemap URLs may or may not end in `/` depending on `trailingSlash`
// config, so table keys and lookups share one slash-insensitive form
// (the root `/` is already slash-less and passes through untouched).
const normalize = (pathname: string): string =>
  pathname.replace(/(.)\/$/u, "$1");

// Legal pages localize their slugs (`terminos` vs `terms`), so the sitemap
// integration cannot pair them by stripping the locale prefix. Each set is
// built from the shared hreflang spec, so it mirrors the `<head>` alternates
// emitted by `Legal.astro` by construction.
const alternateSet = (slug: LegalSlug): readonly AlternatePath[] =>
  alternatePaths((locale): string => `/${legalSlugs[locale][slug]}/`).map(
    ({ locale, lang, path }): AlternatePath => ({
      lang,
      path: localePath(locale, path),
    }),
  );

const alternateSets: readonly (readonly AlternatePath[])[] =
  LEGAL_SLUGS.map(alternateSet);

const LEGAL_ALTERNATES_BY_PATHNAME: ReadonlyMap<
  string,
  readonly AlternatePath[]
> = new Map(
  alternateSets.flatMap(
    (
      alternates: readonly AlternatePath[],
    ): [string, readonly AlternatePath[]][] =>
      alternates.map(
        (alternate: AlternatePath): [string, readonly AlternatePath[]] => [
          normalize(alternate.path),
          alternates,
        ],
      ),
  ),
);

// Shared empty result: absence is a value here, so consumers never branch on
// `null` and non-legal items keep their identity.
const NO_ALTERNATES: readonly AlternatePath[] = [];

const alternatesFor = (url: string): readonly AlternatePath[] =>
  LEGAL_ALTERNATES_BY_PATHNAME.get(normalize(new URL(url).pathname)) ??
  NO_ALTERNATES;

const toLink =
  (base: string) =>
  ({ lang, path }: AlternatePath): LinkItem => ({
    url: new URL(path, base).href,
    lang,
  });

// `@astrojs/sitemap`'s i18n option attaches one link per locale before
// `serialize` runs but never emits `x-default` (`dist/generate-sitemap.js`),
// so the default-locale link is mirrored as `x-default` to keep the sitemap
// matching the `<head>` annotations.
const withXDefault = (item: SitemapItem): SitemapItem => {
  const links: readonly LinkItem[] = item.links ?? [];
  const xDefaults: readonly LinkItem[] = links
    .filter((link: LinkItem): boolean => link.lang === HREFLANG[DEFAULT_LOCALE])
    .map((link: LinkItem): LinkItem => ({ url: link.url, lang: X_DEFAULT }));
  const declared: boolean = links.some(
    (link: LinkItem): boolean => link.lang === X_DEFAULT,
  );
  return declared || xDefaults.length === 0
    ? item
    : { ...item, links: [...links, ...xDefaults] };
};

export const serializeSitemapItem = (item: SitemapItem): SitemapItem => {
  const alternates: readonly AlternatePath[] = alternatesFor(item.url);
  return alternates.length === 0
    ? withXDefault(item)
    : { ...item, links: alternates.map(toLink(item.url)) };
};
