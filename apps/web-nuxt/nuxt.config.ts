import process from 'node:process';
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

    css: ['~/assets/css/tailwind.css'],

    dayjs: {
        locales: ['en'],
        defaultLocale: 'en',
    },

    modules: [
        '@nuxthub/core',
        '@nuxt/image',
        '@nuxt/icon',
        'dayjs-nuxt',
        '@vueuse/nuxt',
        '@nuxt/hints',
        '@nuxt/eslint',
    ],

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

    vite: {
        plugins: [tailwindcss()],
        build: {
            sourcemap: false,
        },
    },
});
