// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import { DEFAULT_LOCALE, HREFLANG } from './src/consts';

// https://astro.build/config
export default defineConfig({
    site: 'https://cotrasoft.co',
    output: "static",
    integrations: [mdx(), sitemap({
        i18n: {
            defaultLocale: DEFAULT_LOCALE,
            locales: HREFLANG,
        },
    }), react()],
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