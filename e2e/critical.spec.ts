import { expect, test, type Page } from "@playwright/test";

const PUBLISHED_SLUG = "dos-anos-cotrasoft";
const POST_PATH = `/blog/${PUBLISHED_SLUG}/`;
const SITE_ORIGIN = "https://cotrasoft.co";

async function expectAttribute(
  page: Page,
  selector: string,
  attribute: string,
  expected: string,
): Promise<string> {
  const value: string | null = await page.getAttribute(selector, attribute);
  expect(value).toBe(expected);
  return expected;
}

const HREFLANGS: ReadonlyArray<string> = ["es-CO", "en-US", "x-default"];

async function expectHreflangTrio(page: Page): Promise<ReadonlyArray<string>> {
  for (const hreflang of HREFLANGS) {
    await expect(
      page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
    ).toHaveCount(1);
  }
  return HREFLANGS;
}

test.describe("critical routes", () => {
  test("home serves metadata and blog navigation", async ({
    page,
  }): Promise<string> => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Cotrasoft/);
    await expect(page.locator('html[lang="es"]')).toHaveCount(1);
    const canonical: string = await expectAttribute(
      page,
      'link[rel="canonical"]',
      "href",
      `${SITE_ORIGIN}/`,
    );

    const ogTitle: string | null = await page.getAttribute(
      'meta[property="og:title"]',
      "content",
    );
    expect(ogTitle).toContain("Cotrasoft");

    await expectAttribute(page, 'nav a[href="/blog/"]', "href", "/blog/");
    await expect(page.locator('script[src*="client."]')).toHaveCount(0);
    return canonical;
  });

  test("english home serves localized metadata", async ({
    page,
  }): Promise<string> => {
    await page.goto("/en/");

    await expect(page.locator('html[lang="en"]')).toHaveCount(1);
    await expect(page).toHaveTitle(/Cotrasoft/);
    await expectAttribute(
      page,
      'link[rel="canonical"]',
      "href",
      `${SITE_ORIGIN}/en/`,
    );
    return expectAttribute(
      page,
      'meta[property="og:locale"]',
      "content",
      "en_US",
    );
  });

  test("blog index links the published post with LCP eager image", async ({
    page,
  }): Promise<string | null> => {
    await page.goto("/blog/");

    await expect(page).toHaveTitle(/Blog/);

    const card = page.locator(`a[href="${POST_PATH}"]`).first();
    await expect(card).toBeVisible();
    const href: string | null = await card.getAttribute("href");
    expect(href).toBe(POST_PATH);

    const featuredImage = card.locator('img[fetchpriority="high"]');
    await expect(featuredImage).toHaveAttribute("loading", "eager");
    await expect(featuredImage).toHaveAttribute("fetchpriority", "high");
    return href;
  });

  test("blog post page renders title and canonical", async ({
    page,
  }): Promise<string> => {
    await page.goto(POST_PATH);

    await expect(page.locator("article h1")).toContainText(/Cotrasoft/);
    return expectAttribute(
      page,
      'link[rel="canonical"]',
      "href",
      `${SITE_ORIGIN}${POST_PATH}`,
    );
  });

  const LEGAL_CASES: ReadonlyArray<{ path: string; heading: string }> = [
    { path: "/terminos/", heading: "Términos de Servicio" },
    { path: "/en/terms/", heading: "Terms of Service" },
  ];

  for (const entry of LEGAL_CASES) {
    test(`legal page ${entry.path} renders with bidirectional hreflang`, async ({
      page,
    }): Promise<ReadonlyArray<string>> => {
      await page.goto(entry.path);
      await expect(page.locator("article h1")).toContainText(entry.heading);
      return expectHreflangTrio(page);
    });
  }

  test("sitemap index is served", async ({ request }): Promise<number> => {
    const response = await request.get("/sitemap-index.xml");
    expect(response.ok()).toBe(true);
    const body: string = await response.text();
    expect(body).toContain("<sitemapindex");
    expect(body).toContain("cotrasoft.co");
    return response.status();
  });

  test("rss feed is served", async ({ request }): Promise<number> => {
    const response = await request.get("/rss.xml");
    expect(response.ok()).toBe(true);
    const body: string = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("cotrasoft.co");
    return response.status();
  });
});
