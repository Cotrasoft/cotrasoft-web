import {
  ChangeFreqEnum,
  type LinkItem,
  type SitemapItem,
} from "@astrojs/sitemap";
import { describe, expect, test } from "vitest";
import { DEFAULT_LOCALE, HREFLANG, SUPPORTED_LOCALES } from "../consts";
import {
  type HreflangAlternate,
  localizedAlternates,
  pageAlternates,
} from "./hreflang";
import { LEGAL_SLUGS, legalSlugs } from "./legal";
import { serializeSitemapItem } from "./sitemap";

const SITE = "https://cotrasoft.co";

const item = (url: string): SitemapItem => ({ url });

const linksOf = (result: SitemapItem): LinkItem[] => result.links ?? [];

const xDefaultHrefs = (alternates: readonly HreflangAlternate[]): string[] =>
  alternates
    .filter(
      (alternate: HreflangAlternate): boolean =>
        alternate.hreflang === "x-default",
    )
    .map((alternate: HreflangAlternate): string => alternate.href);

const xDefaultLinks = (sitemapItem: SitemapItem): string[] =>
  linksOf(serializeSitemapItem(sitemapItem))
    .filter((link: LinkItem): boolean => link.lang === "x-default")
    .map((link: LinkItem): string => link.url);

// Expected sets hard-code every URL and hreflang literal on purpose: they are
// an independent oracle, so a typo in a shared constant must fail here rather
// than pass by construction.
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

  test("leaves items that already declare x-default untouched", () => {
    const withLinks: SitemapItem = { url: `${SITE}/`, links: termsLinks };

    expect(serializeSitemapItem(withLinks)).toBe(withLinks);
  });

  test("replaces pre-populated links on legal items with the complete set", () => {
    const prePopulated: SitemapItem = {
      url: `${SITE}/terminos/`,
      links: [{ url: `${SITE}/en/terms/`, lang: "en-US" }],
    };

    expect(linksOf(serializeSitemapItem(prePopulated))).toEqual(termsLinks);
  });

  test("mirrors the default-locale link as x-default on paired pages", () => {
    const paired: SitemapItem = {
      url: `${SITE}/en/about/`,
      links: [
        { url: `${SITE}/about/`, lang: "es-CO" },
        { url: `${SITE}/en/about/`, lang: "en-US" },
      ],
    };

    expect(linksOf(serializeSitemapItem(paired))).toEqual([
      { url: `${SITE}/about/`, lang: "es-CO" },
      { url: `${SITE}/en/about/`, lang: "en-US" },
      { url: `${SITE}/about/`, lang: "x-default" },
    ]);
  });

  test("mirrors x-default on the default-locale member of a pair", () => {
    const paired: SitemapItem = {
      url: `${SITE}/`,
      links: [
        { url: `${SITE}/`, lang: "es-CO" },
        { url: `${SITE}/en/`, lang: "en-US" },
      ],
    };

    expect(linksOf(serializeSitemapItem(paired))).toEqual([
      { url: `${SITE}/`, lang: "es-CO" },
      { url: `${SITE}/en/`, lang: "en-US" },
      { url: `${SITE}/`, lang: "x-default" },
    ]);
  });

  test("leaves items whose links have no default-locale entry untouched", () => {
    // Synthetic: the integration emits no links at all for a single-locale
    // cluster, so this only pins withXDefault's defensive branch.
    const englishOnly: SitemapItem = {
      url: `${SITE}/en/only/`,
      links: [{ url: `${SITE}/en/only/`, lang: "en-US" }],
    };

    expect(serializeSitemapItem(englishOnly)).toBe(englishOnly);
  });

  test("preserves lastmod, priority and changefreq when appending x-default", () => {
    const withMeta: SitemapItem = {
      url: `${SITE}/en/about/`,
      lastmod: "2026-08-24T00:00:00.000Z",
      priority: 0.7,
      changefreq: ChangeFreqEnum.WEEKLY,
      links: [
        { url: `${SITE}/about/`, lang: "es-CO" },
        { url: `${SITE}/en/about/`, lang: "en-US" },
      ],
    };

    expect(serializeSitemapItem(withMeta)).toEqual({
      ...withMeta,
      links: [
        { url: `${SITE}/about/`, lang: "es-CO" },
        { url: `${SITE}/en/about/`, lang: "en-US" },
        { url: `${SITE}/about/`, lang: "x-default" },
      ],
    });
  });

  test("treats an empty links array as no counterpart yet", () => {
    const emptyLinks: SitemapItem = { url: `${SITE}/terminos/`, links: [] };

    expect(linksOf(serializeSitemapItem(emptyLinks))).toEqual(termsLinks);
  });

  test("leaves pages without any locale links untouched", () => {
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

describe("sitemap and <head> x-default agreement", () => {
  const pairedRoutes: readonly {
    readonly path: string;
    readonly sitemapItem: SitemapItem;
  }[] = [
    {
      path: "/",
      sitemapItem: {
        url: `${SITE}/en/`,
        links: [
          { url: `${SITE}/`, lang: "es-CO" },
          { url: `${SITE}/en/`, lang: "en-US" },
        ],
      },
    },
    {
      path: "/about/",
      sitemapItem: {
        url: `${SITE}/en/about/`,
        links: [
          { url: `${SITE}/about/`, lang: "es-CO" },
          { url: `${SITE}/en/about/`, lang: "en-US" },
        ],
      },
    },
  ];

  test.each(pairedRoutes)(
    "matches pageAlternates on $path",
    ({
      path,
      sitemapItem,
    }: {
      readonly path: string;
      readonly sitemapItem: SitemapItem;
    }) => {
      expect(xDefaultLinks(sitemapItem)).toEqual(
        xDefaultHrefs(pageAlternates(path)),
      );
    },
  );

  test.each(LEGAL_SLUGS)("matches localizedAlternates on %s", (slug) => {
    const esPath = `${SITE}/${legalSlugs[DEFAULT_LOCALE][slug]}/`;

    expect(xDefaultLinks(item(esPath))).toEqual(
      xDefaultHrefs(
        localizedAlternates(
          (locale): string => `/${legalSlugs[locale][slug]}/`,
        ),
      ),
    );
  });
});
