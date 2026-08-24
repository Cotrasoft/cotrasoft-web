# Monthly AI-visibility review — cotrasoft.co

Ritual from [sc-154](https://app.shortcut.com/cotrasoft/story/154). Run during the
first week of every month. Timebox: ~45 min.

## Access

| Tool | Account | Access |
| --- | --- | --- |
| [Google Search Console](https://search.google.com/search-console?resource_id=sc-domain:cotrasoft.co) | juanprmendoza96@gmail.com | Delegated (view) — domain property is DNS-verified by the owner |
| [Bing Webmaster Tools](https://www.bing.com/webmasters/home?siteUrl=https://cotrasoft.co/) | Microsoft account (already signed in on the shared browser) | Full |

## Monthly checklist

### 1. GSC — search + generative AI performance

1. Open the [generative AI features report](https://search.google.com/search-console/performance/search-analytics/ai?resource_id=sc-domain:cotrasoft.co)
   (also linked as "Open the Google Search generative AI features performance
   report" from the [Performance report](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:cotrasoft.co)).
2. Record vs. last month: total impressions in AI features and top pages.
3. In the [Performance report](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:cotrasoft.co)
   record: clicks, impressions, average position (the **Search appearance** tab
   breaks out AI features once they accrue clicks).
4. Check the [Pages report](https://search.google.com/search-console/index?resource_id=sc-domain:cotrasoft.co)
   for indexing drift.
5. Confirm [sitemap status](https://search.google.com/search-console/sitemaps?resource_id=sc-domain:cotrasoft.co)
   is still **Success**.

### 2. Bing — AI Performance report

1. Open [AI Performance](https://www.bing.com/webmasters/aiperformance?siteUrl=https://cotrasoft.co/)
   (citation sources: Microsoft Copilots and partners).
2. Record vs. last month: **Total Citations**, **Avg. Cited Pages**, top
   **Grounding Queries** (with intent/topic) and top cited **Pages**.
3. Check [Search Performance](https://www.bing.com/webmasters/searchperf?siteUrl=https://cotrasoft.co/)
   for crawl/index drift.

### 3. Citation spot-checks (ChatGPT, Perplexity, Gemini)

Ask the same 10 prompts in fresh sessions of each engine and note whether
Cotrasoft is mentioned/linked:

1. `cotrasoft`
2. `Cotrasoft opiniones`
3. `cooperativa de desarrolladores en Colombia`
4. `software development cooperative Colombia`
5. `rescate de MVP`
6. `MVP rescue development services`
7. `desarrollo acelerado de software con IA`
8. `AI-augmented senior development teams`
9. `consultoría técnica de software Colombia`
10. `contratar desarrolladores senior en Colombia`

Log: cited (Y/N), which engine, which URL was cited. Revisit the prompt list
quarterly as positioning evolves.

### 4. Save evidence

Append screenshots to this folder (`YYYY-MM-` prefix) and post a summary
comment on the SEO & GEO epic.

## Baseline — 2026-08-24

| Metric | Value |
| --- | --- |
| GSC clicks / impressions (3 mo) | 14 / 117 (avg. position 13.2) |
| GSC AI-feature impressions | **27** — homepage 23, `/en/` 9, `/blog/` 2 |
| GSC indexing | 11 indexed / 7 not indexed |
| GSC sitemap | `sitemap-index.xml` — Success (submitted 2026-05-16) |
| GSC generative AI | Include (Settings → AI controls) |
| Bing AI citations | 0 (chart live since 2026-05-24) |
| Bing sitemap | Submitted 2026-08-24, processing |

Screenshots: `gsc-overview.png`, `gsc-genai-report.png`, `gsc-sitemaps.png`,
`gsc-settings.png`, `bing-dashboard.png`, `bing-ai-performance.png`.

## Adding future verification properties

`BaseHead` renders the site-scoped `SITE_VERIFICATION` map
(`src/consts.ts`) as `<meta name="…" content="…">` tags on every page — new
webmaster/AI-engine properties verify without markup changes:

```ts
export const SITE_VERIFICATION: Readonly<Record<string, string>> = {
  "google-site-verification": "TOKEN",
  "msvalidate.01": "TOKEN",
};
```

Pages needing an override can pass a `verification` prop to `BaseHead`.

The GSC domain property is DNS-verified (`google-site-verification` TXT at
Cloudflare), so no meta token is wired today. `verification-meta-proof.png`
shows the mechanism verified live with a demo token.
