// https://nuxt.com/docs/api/configuration/nuxt-config
// import process from 'node:process';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
    ssr: true,

    devtools: { enabled: true },
    hints: {
        features: {
            // logs disabled: false positives from reka-ui (shadcn-vue)
            hydration: { logs: false },
            lazyLoad: { logs: false },
            webVitals: { logs: false },
            thirdPartyScripts: { logs: false },
            htmlValidate: { logs: false },
        },
    },

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
        // '@nuxt/test-utils/module',
        '@nuxt/eslint',
        // '@nuxt/fonts',
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
        plugins: [tailwindcss(), svgLoader()],
        resolve: {
            alias: {
                // Workspaces don't create node_modules symlinks — postcss-import needs this for CSS @import
                '@repo/styles': fileURLToPath(new URL('../../packages/styles/src', import.meta.url)),
            },
        },
        build: {
            sourcemap: false,
        },
        optimizeDeps: {
            include: [
                '@tanstack/vue-query',
                '@tanstack/vue-virtual',
                'class-variance-authority',
                'reka-ui',
                '@lucide/vue',
                'clsx',
                'tailwind-merge',
            ],
        },
    },
});
