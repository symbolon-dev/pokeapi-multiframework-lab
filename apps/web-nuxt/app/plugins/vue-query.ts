import { VueQueryPlugin } from '@tanstack/vue-query';

export default defineNuxtPlugin({
    name: 'vue-query',
    setup(nuxtApp) {
        nuxtApp.vueApp.use(VueQueryPlugin);
    },
});
