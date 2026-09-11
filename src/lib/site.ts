const missingSite = (): URL => {
  throw new Error(
    "`site` is not configured in astro.config.mjs; JSON-LD components require an absolute site URL.",
  );
};

export const siteUrl = (site: URL | undefined): URL => site ?? missingSite();
