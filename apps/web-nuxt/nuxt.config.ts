// https://nuxt.com/docs/api/configuration/nuxt-config
// import process from 'node:process';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },

    app: {
        head: {
            title: 'Pokémon Team Builder',
            meta: [
                { name: 'description', content: 'An application for browsing Pokémon' },
            ],
            htmlAttrs: {
                lang: 'en',
            },
        },
    },

    compatibilityDate: '2025-07-15',

    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'light',
        storage: 'cookie',
    },

    css: ['~/assets/css/tailwind.css'],

    // dayjs: {
    //     locales: ['en'],
    //     defaultLocale: 'en',
    // },

    modules: [
        '@nuxt/test-utils/module',
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/hints',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/color-mode',
        '@vueuse/nuxt',
        'shadcn-nuxt',
        // 'dayjs-nuxt',
    ],

    shadcn: {
        prefix: '',
        componentDir: '@/components/ui',
    },

    eslint: {
        config: {
            standalone: false,
        },
    },

    nitro: {
        experimental: {
            openAPI: true,
        },
    },

    runtimeConfig: {
        public: {},
    },

    routeRules: {
        '/': { prerender: true },
        '/api/generations': { prerender: true },
        '/api/types': { prerender: true },
        '/api/type/**': { isr: 86_400 }, // 24h
        '/api/pokemon/**': { isr: 86_400 }, // 24h
        '/api/search': { swr: 30 }, // 30s
    },

    vite: {
        // @ts-expect-error - Vite plugin types are not compatible with Nuxt's Vite configuration
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                // Bun workspaces don't create node_modules symlinks — postcss-import needs this for CSS @import
                '@repo/styles': fileURLToPath(new URL('../../packages/styles/src', import.meta.url)),
            },
        },
        build: {
            sourcemap: false,
        },
    },
});
