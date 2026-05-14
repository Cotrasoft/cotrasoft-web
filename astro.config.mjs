// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cotrasoft.co',
  output: "static",
  integrations: [mdx(), sitemap(), react()],
    i18n: {
        locales: ["es", "en"],
        defaultLocale: "es",
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: true,
        },
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Inter',
            cssVariable: '--font-inter',
            weights: ['100 900'],
            styles: ['normal'],
            subsets: ['latin', 'latin-ext'],
            fallbacks: ['system-ui', 'sans-serif'],
        },
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});