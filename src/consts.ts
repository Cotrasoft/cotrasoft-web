// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export type SupportedLang = "es" | "en";

// Mirrors `defaultLocale` in astro.config.mjs (the canonical build-time value).
// Astro exposes no runtime default locale, so this is the fallback used where
// `Astro.currentLocale` is absent (the prefix-less default locale).
export const DEFAULT_LOCALE: SupportedLang = "es";

// Mirrors `site` in astro.config.mjs (the canonical build-time value).
// Typed fallback for `Astro.site` / `context.site`, which are `URL | undefined`
// (https://docs.astro.build/en/reference/api-reference/#site).
export const SITE_URL: URL = new URL("https://cotrasoft.co");

// Canonical entity definition, reused verbatim across meta description,
// hero subheading, footer and Organization JSON-LD so every surface
// describes Cotrasoft with the same words.
export const ENTITY_DESCRIPTION: Record<SupportedLang, string> = {
  es: "Cotrasoft es la cooperativa colombiana de profesionales de software que entrega equipos senior potenciados por IA: rescate de MVP, desarrollo acelerado y consultoría técnica.",
  en: "Cotrasoft is the Colombian cooperative of software professionals that delivers MVP rescue, accelerated development, and technical consulting with senior AI-powered teams.",
};

export const SITE_DESCRIPTION = ENTITY_DESCRIPTION[DEFAULT_LOCALE];

// Localized page titles; descriptions live in ENTITY_DESCRIPTION.
export const SITE_TITLES: Record<SupportedLang, string> = {
  es: "Cotrasoft - Cooperativa de Desarrolladores",
  en: "Cotrasoft - Software Developer Cooperative",
};

// Open Graph locale tags as tables (not ternaries) so both locales are
// forced to be present and visible side by side. The alternate is derived
// from OG_LOCALE (not a second set of literals) so the pair shares values
// instead of drifting apart.
export const OG_LOCALE: Record<SupportedLang, string> = {
  es: "es_CO",
  en: "en_US",
};

export const OG_LOCALE_ALTERNATE: Record<SupportedLang, string> = {
  es: OG_LOCALE.en,
  en: OG_LOCALE.es,
};

// Mirrors the `locales` array in astro.config.mjs plus the sitemap `i18n`
// locales map. Single source so `<head>` alternates, sitemap hreflang and
// locale iteration cannot drift apart. Derived from a Record so adding a
// locale to `SupportedLang` breaks the build here instead of silently
// falling back to `DEFAULT_LOCALE`.
const LOCALE_IDENTITY: Record<SupportedLang, SupportedLang> = {
  es: "es",
  en: "en",
};

// Frozen values of the identity table: exhaustive by construction, no
// duplicated literal list to keep in sync.
export const SUPPORTED_LOCALES: readonly SupportedLang[] = Object.freeze(
  Object.values(LOCALE_IDENTITY),
);

// `Object.hasOwn` (not the `in` operator, which also matches
// Object.prototype keys like "toString").
const isSupportedLang = (value: string): value is SupportedLang =>
  Object.hasOwn(LOCALE_IDENTITY, value);

// `Astro.currentLocale` is absent on the prefix-less default locale, so this
// is the single typed entry point every component uses instead of casting.
// The optional parameter models absence without naming it; unknown strings
// fall back to `DEFAULT_LOCALE`, matching Astro's own defaulting
// (https://docs.astro.build/en/reference/api-reference/#currentlocale).
export const resolveLocale = (currentLocale?: string): SupportedLang => {
  const candidate: string = currentLocale ?? "";
  return isSupportedLang(candidate) ? candidate : DEFAULT_LOCALE;
};

// BCP 47 hreflang tags emitted in `<link rel="alternate">` and the sitemap.
export const HREFLANG: Record<SupportedLang, string> = {
  es: "es-CO",
  en: "en-US",
};

// `x-default` hreflang value, always pointing at the default-locale page.
// Single source so `<head>` alternates and the sitemap cannot drift apart.
export const X_DEFAULT = "x-default" as const;
