import { describe, expect, test } from "vitest";
import {
  type HreflangAlternate,
  localizedAlternates,
  pageAlternates,
  selfAlternates,
} from "./hreflang";
import { legalSlugs } from "./legal";

const SITE = "https://cotrasoft.co";

// Hard-coded URLs and hreflang literals as an independent oracle: a typo in a
// shared constant must fail here rather than pass by construction.
const termsSet: HreflangAlternate[] = [
  { hreflang: "es-CO", href: `${SITE}/terminos/` },
  { hreflang: "en-US", href: `${SITE}/en/terms/` },
  { hreflang: "x-default", href: `${SITE}/terminos/` },
];

describe("pageAlternates", () => {
  test("builds every locale plus x-default for a shared path", () => {
    expect(pageAlternates("/")).toEqual([
      { hreflang: "es-CO", href: `${SITE}/` },
      { hreflang: "en-US", href: `${SITE}/en/` },
      { hreflang: "x-default", href: `${SITE}/` },
    ]);
  });

  test("builds the about page set for every locale plus x-default", () => {
    expect(pageAlternates("/about/")).toEqual([
      { hreflang: "es-CO", href: `${SITE}/about/` },
      { hreflang: "en-US", href: `${SITE}/en/about/` },
      { hreflang: "x-default", href: `${SITE}/about/` },
    ]);
  });
});

describe("localizedAlternates", () => {
  test("localizes the path per locale and points x-default at the default one", () => {
    expect(
      localizedAlternates((locale): string => `/${legalSlugs[locale].terms}/`),
    ).toEqual(termsSet);
  });

  test("localizes the privacy slug and points x-default at the default one", () => {
    expect(
      localizedAlternates(
        (locale): string => `/${legalSlugs[locale].privacy}/`,
      ),
    ).toEqual([
      { hreflang: "es-CO", href: `${SITE}/privacidad/` },
      { hreflang: "en-US", href: `${SITE}/en/privacy/` },
      { hreflang: "x-default", href: `${SITE}/privacidad/` },
    ]);
  });
});

describe("selfAlternates", () => {
  test("points hreflang and x-default at the default-locale page itself", () => {
    const href = `${SITE}/blog/dos-anos-cotrasoft/`;
    expect(selfAlternates("es", href)).toEqual([
      { hreflang: "es-CO", href },
      { hreflang: "x-default", href },
    ]);
  });

  test("points hreflang and x-default at the English-only page itself", () => {
    const href = `${SITE}/en/only-page/`;
    expect(selfAlternates("en", href)).toEqual([
      { hreflang: "en-US", href },
      { hreflang: "x-default", href },
    ]);
  });

  test("rejects a relative href instead of emitting a relative hreflang", () => {
    expect(() => selfAlternates("es", "/blog/")).toThrow();
  });
});
