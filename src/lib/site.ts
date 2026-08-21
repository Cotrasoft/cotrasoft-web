export function siteUrl(site: URL | undefined): URL {
  if (!site) {
    throw new Error(
      "`site` is not configured in astro.config.mjs; JSON-LD components require an absolute site URL.",
    );
  }
  return site;
}
