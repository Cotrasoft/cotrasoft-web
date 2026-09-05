import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import {
  DEFAULT_LOCALE,
  HREFLANG,
  SUPPORTED_LOCALES,
  X_DEFAULT,
} from "../consts";
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
// integration cannot pair them by stripping the locale prefix. Each set below
// mirrors the `<head>` alternates emitted by `Legal.astro`.
const alternateSet = (slug: LegalSlug): readonly AlternatePath[] => [
  ...SUPPORTED_LOCALES.map(
    (locale): AlternatePath => ({
      lang: HREFLANG[locale],
      path: localePath(locale, `/${legalSlugs[locale][slug]}/`),
    }),
  ),
  {
    lang: X_DEFAULT,
    path: localePath(DEFAULT_LOCALE, `/${legalSlugs[DEFAULT_LOCALE][slug]}/`),
  },
];

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

const lookup = (url: string): readonly AlternatePath[] | null =>
  LEGAL_ALTERNATES_BY_PATHNAME.get(normalize(new URL(url).pathname)) ?? null;

const toLink =
  (base: string) =>
  ({ lang, path }: AlternatePath): LinkItem => ({
    url: new URL(path, base).href,
    lang,
  });

export const serializeSitemapItem = (item: SitemapItem): SitemapItem => {
  const alternates: readonly AlternatePath[] | null = item.links?.length
    ? null
    : lookup(item.url);
  return alternates === null
    ? item
    : { ...item, links: alternates.map(toLink(item.url)) };
};
