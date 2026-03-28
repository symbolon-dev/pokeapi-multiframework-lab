import type { ConfigOptions } from '@nuxt/test-utils/playwright';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig<ConfigOptions>({
    use: {
        nuxt: {
            rootDir: './',
        },
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
