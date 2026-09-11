export const organizationId = (siteURL: URL): string =>
  new URL("#organization", siteURL).href;
