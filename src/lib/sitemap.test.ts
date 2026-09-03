import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import { describe, expect, test } from "vitest";
import { DEFAULT_LOCALE, HREFLANG, SUPPORTED_LOCALES } from "../consts";
import { LEGAL_SLUGS, legalSlugs } from "./legal";
import { serializeSitemapItem } from "./sitemap";

const SITE = "https://cotrasoft.co";

const item = (url: string): SitemapItem => ({ url });

const linksOf = (result: SitemapItem): LinkItem[] => result.links ?? [];

const termsLinks: LinkItem[] = [
  { url: `${SITE}/terminos/`, lang: "es-CO" },
  { url: `${SITE}/en/terms/`, lang: "en-US" },
  { url: `${SITE}/terminos/`, lang: "x-default" },
];

const privacyLinks: LinkItem[] = [
  { url: `${SITE}/privacidad/`, lang: "es-CO" },
  { url: `${SITE}/en/privacy/`, lang: "en-US" },
  { url: `${SITE}/privacidad/`, lang: "x-default" },
];

describe("serializeSitemapItem", () => {
  test("pairs the Spanish terms page with its English counterpart", () => {
    expect(linksOf(serializeSitemapItem(item(`${SITE}/terminos/`)))).toEqual(
      termsLinks,
    );
  });

  test("pairs the English terms page with the same bidirectional set", () => {
    expect(linksOf(serializeSitemapItem(item(`${SITE}/en/terms/`)))).toEqual(
      termsLinks,
    );
  });

  test("pairs the Spanish privacy page with its English counterpart", () => {
    expect(linksOf(serializeSitemapItem(item(`${SITE}/privacidad/`)))).toEqual(
      privacyLinks,
    );
  });

  test("pairs the English privacy page with the same bidirectional set", () => {
    expect(linksOf(serializeSitemapItem(item(`${SITE}/en/privacy/`)))).toEqual(
      privacyLinks,
    );
  });

  test("leaves items that already carry links untouched", () => {
    const withLinks: SitemapItem = { url: `${SITE}/`, links: termsLinks };

    expect(serializeSitemapItem(withLinks)).toBe(withLinks);
  });

  test("leaves pages without a localized counterpart untouched", () => {
    const about: SitemapItem = item(`${SITE}/about/`);

    expect(serializeSitemapItem(about)).toBe(about);
  });

  test("pairs legal URLs with or without a trailing slash", () => {
    expect(linksOf(serializeSitemapItem(item(`${SITE}/terminos`)))).toEqual(
      termsLinks,
    );
    expect(linksOf(serializeSitemapItem(item(`${SITE}/en/terms`)))).toEqual(
      termsLinks,
    );
  });
});

describe("every localized legal page", () => {
  test("resolves each pathname in a set to the identical set", () => {
    for (const slug of LEGAL_SLUGS) {
      const expected: LinkItem[] = [
        ...SUPPORTED_LOCALES.map(
          (locale): LinkItem => ({
            url: `${SITE}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/${legalSlugs[locale][slug]}/`,
            lang: HREFLANG[locale],
          }),
        ),
        {
          url: `${SITE}/${legalSlugs[DEFAULT_LOCALE][slug]}/`,
          lang: "x-default",
        },
      ];
      for (const link of expected) {
        expect(linksOf(serializeSitemapItem(item(link.url)))).toEqual(expected);
      }
    }
  });

  test("points x-default at the default-locale page for every slug", () => {
    for (const slug of LEGAL_SLUGS) {
      const links: LinkItem[] = linksOf(
        serializeSitemapItem(
          item(`${SITE}/${legalSlugs[DEFAULT_LOCALE][slug]}/`),
        ),
      );
      expect(
        links.filter((link: LinkItem): boolean => link.lang === "x-default"),
      ).toEqual([
        {
          url: `${SITE}/${legalSlugs[DEFAULT_LOCALE][slug]}/`,
          lang: "x-default",
        },
      ]);
    }
  });
});
