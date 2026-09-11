export type SupportedLang = "es" | "en";

// Mirrors `defaultLocale` in astro.config.mjs; Astro exposes none at runtime.
export const DEFAULT_LOCALE: SupportedLang = "es";

// `site` in astro.config.mjs is set from this, and it is the typed fallback for
// `Astro.site` / `context.site`, which are `URL | undefined`.
export const SITE_URL: URL = new URL("https://cotrasoft.co");

// The short brand, as opposed to `ENTITY_VALUES.name` (the full legal name).
export const BRAND_NAME = "Cotrasoft";

// Reused verbatim across meta description, hero, footer and JSON-LD.
export const ENTITY_DESCRIPTION: Record<SupportedLang, string> = {
  es: "Cotrasoft es la cooperativa colombiana de profesionales de software que entrega equipos senior potenciados por IA: rescate de MVP, desarrollo acelerado y consultoría técnica.",
  en: "Cotrasoft is the Colombian cooperative of software professionals that delivers MVP rescue, accelerated development, and technical consulting with senior AI-powered teams.",
};

export const SITE_DESCRIPTION = ENTITY_DESCRIPTION[DEFAULT_LOCALE];

export const SITE_TITLES: Record<SupportedLang, string> = {
  es: "Cotrasoft - Cooperativa de Desarrolladores",
  en: "Cotrasoft - Software Developer Cooperative",
};

// The alternate derives from OG_LOCALE rather than repeating the literals.
export const OG_LOCALE: Record<SupportedLang, string> = {
  es: "es_CO",
  en: "en_US",
};

export const OG_LOCALE_ALTERNATE: Record<SupportedLang, string> = {
  es: OG_LOCALE.en,
  en: OG_LOCALE.es,
};

// Mirrors the `locales` array in astro.config.mjs and the sitemap `i18n` map.
// Derived from a Record so a new `SupportedLang` breaks the build here rather
// than silently falling back to `DEFAULT_LOCALE`.
const LOCALE_IDENTITY: Record<SupportedLang, SupportedLang> = {
  es: "es",
  en: "en",
};

export const SUPPORTED_LOCALES: readonly SupportedLang[] = Object.freeze(
  Object.values(LOCALE_IDENTITY),
);

// `Object.hasOwn`, not `in`: `in` also matches Object.prototype keys.
const isSupportedLang = (value: string): value is SupportedLang =>
  Object.hasOwn(LOCALE_IDENTITY, value);

// `Astro.currentLocale` is absent on the prefix-less default locale. Single
// typed entry point; use this instead of casting.
export const resolveLocale = (currentLocale?: string): SupportedLang => {
  const candidate: string = currentLocale ?? "";
  return isSupportedLang(candidate) ? candidate : DEFAULT_LOCALE;
};

// BCP 47 hreflang tags emitted in `<link rel="alternate">` and the sitemap.
export const HREFLANG: Record<SupportedLang, string> = {
  es: "es-CO",
  en: "en-US",
};

export const X_DEFAULT = "x-default";
