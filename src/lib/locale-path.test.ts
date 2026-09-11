import { describe, expect, test } from "vitest";
import { absoluteLocaleUrl, localePath } from "./locale-path";

const SITE = "https://cotrasoft.co";

describe("localePath", () => {
  test("leaves the default locale prefix-less", () => {
    expect(localePath("es", "/terminos/")).toBe("/terminos/");
  });

  test("prefixes non-default locales", () => {
    expect(localePath("en", "/terms/")).toBe("/en/terms/");
  });

  test("treats an empty path as the locale root", () => {
    expect(localePath("en", "")).toBe("/en/");
  });

  test("rejects repeated slashes", () => {
    expect(() => localePath("en", "/a//b")).toThrow();
  });

  test("rejects query and hash", () => {
    expect(() => localePath("en", "/x?y=1")).toThrow();
    expect(() => localePath("en", "/x#y")).toThrow();
  });

  test("rejects file paths", () => {
    expect(() => localePath("en", "/rss.xml")).toThrow();
  });

  test("rejects backslashes, which the URL parser treats as slashes", () => {
    expect(() => localePath("es", "\\evil")).toThrow();
  });

  test("rejects dot segments, which the URL parser collapses", () => {
    expect(() => localePath("es", "..")).toThrow();
    expect(() => localePath("es", "/a/../b")).toThrow();
    expect(() => localePath("es", "/a/./b")).toThrow();
  });

  test("rejects embedded control characters", () => {
    expect(() => localePath("es", "/\n//evil/")).toThrow();
  });
});

describe("absoluteLocaleUrl", () => {
  test("keeps the default locale prefix-less", () => {
    expect(absoluteLocaleUrl("es", "/terminos/")).toBe(`${SITE}/terminos/`);
  });

  test("prefixes non-default locales", () => {
    expect(absoluteLocaleUrl("en", "/terms/")).toBe(`${SITE}/en/terms/`);
  });

  test("maps the root per locale", () => {
    expect(absoluteLocaleUrl("es", "/")).toBe(`${SITE}/`);
    expect(absoluteLocaleUrl("en", "/")).toBe(`${SITE}/en/`);
  });

  test("normalizes a path without a leading slash", () => {
    expect(absoluteLocaleUrl("en", "terms/")).toBe(`${SITE}/en/terms/`);
  });

  test("adds the trailing slash Astro's helper appends", () => {
    expect(absoluteLocaleUrl("en", "/about")).toBe(`${SITE}/en/about/`);
  });

  test("rejects protocol-relative paths that would replace the origin", () => {
    expect(() => absoluteLocaleUrl("es", "//evil.com/x")).toThrow();
  });

  test("rejects backslashes that would replace the origin", () => {
    expect(() => absoluteLocaleUrl("es", "\\evil")).toThrow();
  });

  test("rejects control characters that would replace the origin", () => {
    expect(() => absoluteLocaleUrl("es", "/\n//evil/")).toThrow();
  });
});
