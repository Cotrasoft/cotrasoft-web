import { describe, expect, test } from "vitest";
import { BRAND_NAME } from "../consts";
import { aboutDocs } from "./about";
import { ENTITY_VALUES, legal, legalSlugs } from "./legal";
import { localePath } from "./locale-path";

// The site shipped two different contact emails before this was enforced.
describe("entity contact details", () => {
  test("the site publishes exactly one email address", () => {
    expect(ENTITY_VALUES.email).toBe("gerencia@cotrasoft.co");
  });

  test("About reads the shared email in both locales", () => {
    for (const doc of Object.values(aboutDocs)) {
      expect(doc.ctaContactHref).toBe(`mailto:${ENTITY_VALUES.email}`);
      const emailField = doc.entityFields.find(
        (field) => field.value === ENTITY_VALUES.email,
      );
      expect(emailField).toBeDefined();
    }
  });

  test("legal documents read the shared email in both locales", () => {
    for (const content of Object.values(legal)) {
      for (const doc of [content.terms, content.privacy]) {
        const values = doc.entity.fields.map((field) => field.value);
        expect(values).toContain(ENTITY_VALUES.email);
      }
    }
  });
});

describe("About titles", () => {
  test("the document title carries the brand and the heading does not", () => {
    for (const doc of Object.values(aboutDocs)) {
      expect(doc.title).toContain(BRAND_NAME);
      expect(doc.heading).not.toContain(BRAND_NAME);
    }
  });
});

describe("language switcher paths", () => {
  test("legal slugs resolve to their localized counterpart", () => {
    expect(localePath("es", `/${legalSlugs.es.terms}/`)).toBe("/terminos/");
    expect(localePath("en", `/${legalSlugs.en.terms}/`)).toBe("/en/terms/");
    expect(localePath("es", `/${legalSlugs.es.privacy}/`)).toBe("/privacidad/");
    expect(localePath("en", `/${legalSlugs.en.privacy}/`)).toBe("/en/privacy/");
  });

  test("a shared path keeps its slug across locales", () => {
    expect(localePath("es", "/about/")).toBe("/about/");
    expect(localePath("en", "/about/")).toBe("/en/about/");
  });
});
