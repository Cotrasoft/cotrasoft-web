import { describe, expect, test } from "vitest";
import { localePath, stripLocalePrefix } from "./locale-path";

describe("stripLocalePrefix", () => {
  test("strips a non-default locale prefix", () => {
    expect(stripLocalePrefix("/en/terms/")).toBe("/terms/");
  });

  test("leaves default-locale paths untouched", () => {
    expect(stripLocalePrefix("/terminos/")).toBe("/terminos/");
  });

  test("leaves the root untouched", () => {
    expect(stripLocalePrefix("/")).toBe("/");
  });

  test("maps a bare locale prefix to the root", () => {
    expect(stripLocalePrefix("/en")).toBe("/");
  });

  test("ignores lookalike first segments", () => {
    expect(stripLocalePrefix("/energy/")).toBe("/energy/");
  });
});

describe("localePath", () => {
  test("leaves the default locale prefix-less", () => {
    expect(localePath("es", "/terminos/")).toBe("/terminos/");
  });

  test("prefixes non-default locales", () => {
    expect(localePath("en", "/terms/")).toBe("/en/terms/");
  });
});
