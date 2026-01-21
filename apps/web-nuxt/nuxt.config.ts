// https://nuxt.com/docs/api/configuration/nuxt-config
// import process from 'node:process';
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
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/hints',
        '@nuxt/icon',
        '@nuxt/image',
        '@vueuse/nuxt',
        'dayjs-nuxt',
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
        // @ts-expect-error https://github.com/tailwindlabs/tailwindcss/issues/18802
        plugins: [tailwindcss()],
        build: {
            sourcemap: false,
        },
    },
});
