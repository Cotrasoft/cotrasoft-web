import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import { DEFAULT_LOCALE, HREFLANG, X_DEFAULT } from "../consts";
import { alternatePaths } from "./hreflang";
import { LEGAL_SLUGS, type LegalSlug, legalSlugs } from "./legal";
import { localePath } from "./locale-path";

interface AlternatePath {
  lang: string;
  path: string;
}

// `trailingSlash` config decides whether sitemap URLs end in `/`, so keys and
// lookups share one slash-insensitive form.
const normalize = (pathname: string): string =>
  pathname.replace(/(.)\/$/u, "$1");

// The integration pairs URLs by stripping the locale prefix, which cannot
// match localized slugs (`terminos` vs `terms`). Built from the shared spec so
// it mirrors `Legal.astro`'s `<head>` by construction.
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

// Empty rather than `null` so non-legal items keep their identity.
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

// `@astrojs/sitemap` attaches one link per locale before `serialize` runs but
// never emits `x-default` (`dist/generate-sitemap.js`), so mirror it here.
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
