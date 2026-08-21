// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Cotrasoft - Cooperativa de Desarrolladores";
export const SITE_DESCRIPTION =
  "Cooperativa de desarrolladores colombianos. Equipos senior potenciados por IA: rescate de MVP, desarrollo acelerado y consultoría técnica.";

export type SupportedLang = "es" | "en";

// Mirrors `defaultLocale` in astro.config.mjs (the canonical build-time value).
// Astro exposes no runtime default locale, so this is the fallback used where
// `Astro.currentLocale` is `undefined` (the prefix-less default locale).
export const DEFAULT_LOCALE: SupportedLang = "es";

// BCP 47 hreflang tags emitted in `<link rel="alternate">` and the sitemap.
export const HREFLANG: Record<SupportedLang, string> = {
  es: "es-CO",
  en: "en-US",
};
