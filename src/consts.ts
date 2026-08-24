// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Cotrasoft - Cooperativa de Desarrolladores";

export type SupportedLang = "es" | "en";

// Mirrors `defaultLocale` in astro.config.mjs (the canonical build-time value).
// Astro exposes no runtime default locale, so this is the fallback used where
// `Astro.currentLocale` is `undefined` (the prefix-less default locale).
export const DEFAULT_LOCALE: SupportedLang = "es";

// Canonical entity definition, reused verbatim across meta description,
// hero subheading, footer and Organization JSON-LD so every surface
// describes Cotrasoft with the same words.
export const ENTITY_DESCRIPTION: Record<SupportedLang, string> = {
  es: "Cotrasoft es la cooperativa colombiana de profesionales de software que entrega equipos senior potenciados por IA: rescate de MVP, desarrollo acelerado y consultoría técnica.",
  en: "Cotrasoft is the Colombian cooperative of software professionals that delivers MVP rescue, accelerated development, and technical consulting with senior AI-powered teams.",
};

export const SITE_DESCRIPTION = ENTITY_DESCRIPTION[DEFAULT_LOCALE];

// Mirrors the `locales` array in astro.config.mjs.
const SUPPORTED_LOCALES: ReadonlyMap<string, SupportedLang> = new Map([
  ["es", "es"],
  ["en", "en"],
]);

// `Astro.currentLocale` is `string | undefined` (undefined on the
// prefix-less default locale), so this is the single typed entry point
// every component uses instead of casting.
export const resolveLocale = (
  currentLocale: string | undefined,
): SupportedLang =>
  SUPPORTED_LOCALES.get(currentLocale ?? "") ?? DEFAULT_LOCALE;
