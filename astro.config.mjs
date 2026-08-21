// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import { DEFAULT_LOCALE, HREFLANG } from "./src/consts";
import { serializeSitemapItem } from "./src/lib/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://cotrasoft.co",
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: HREFLANG,
      },
      serialize: serializeSitemapItem,
    }),
  ],
  i18n: {
    locales: ["es", "en"],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
