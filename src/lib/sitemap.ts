import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import { DEFAULT_LOCALE, HREFLANG, type SupportedLang } from "../consts";
import { type LegalSlug, legalSlugs } from "./legal";

interface AlternatePath {
  lang: string;
  path: string;
}

// Mirrors `prefixDefaultLocale: false` in astro.config.mjs.
const localePath = (locale: SupportedLang, path: string): string =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

// Legal pages localize their slugs (`terminos` vs `terms`), so the sitemap
// integration cannot pair them by stripping the locale prefix. This table maps
// every legal pathname to its full alternate set, mirroring the `<head>`
// alternates emitted by `Legal.astro`.
const LEGAL_ALTERNATES_BY_PATHNAME: ReadonlyMap<
  string,
  readonly AlternatePath[]
> = new Map(
  (Object.keys(legalSlugs[DEFAULT_LOCALE]) as LegalSlug[]).flatMap((slug) => {
    const alternates: readonly AlternatePath[] = [
      ...(Object.keys(HREFLANG) as SupportedLang[]).map((locale) => ({
        lang: HREFLANG[locale],
        path: localePath(locale, `/${legalSlugs[locale][slug]}/`),
      })),
      {
        lang: "x-default",
        path: localePath(
          DEFAULT_LOCALE,
          `/${legalSlugs[DEFAULT_LOCALE][slug]}/`,
        ),
      },
    ];
    return alternates.map((alternate) => [alternate.path, alternates] as const);
  }),
);

export const serializeSitemapItem = (item: SitemapItem): SitemapItem => {
  if (item.links) return item;

  const alternates = LEGAL_ALTERNATES_BY_PATHNAME.get(
    new URL(item.url).pathname,
  );
  if (!alternates) return item;

  const links: LinkItem[] = alternates.map(({ lang, path }) => ({
    url: new URL(path, item.url).href,
    lang,
  }));
  return { ...item, links };
};
