import { logger } from '@/lib/logger';

const REQUEST_TIMEOUT_MS = 15000; // 15 seconds
const TRAILING_SLASH_RE = /\/$/;

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms),
    );
    return Promise.race([promise, timeout]);
}

export async function fetchJson<T>(url: string): Promise<T | undefined> {
    try {
        let res = await withTimeout(fetch(url), REQUEST_TIMEOUT_MS);
        if (!res.ok) {
            logger.warn({ status: res.status, url }, 'HTTP error');
            if (res.status === 500) {
                const fallbackUrl = url.replace(TRAILING_SLASH_RE, '');
                if (fallbackUrl !== url) {
                    logger.warn({ url }, 'Retry without trailing slash');
                    res = await withTimeout(fetch(fallbackUrl), REQUEST_TIMEOUT_MS);
                }
            }
        }

        if (!res.ok) {
            logger.warn({ status: res.status, url }, 'HTTP error after fallback');
            return undefined;
        }

        const text = await res.text();
        try {
            const data = JSON.parse(text) as T;
            return data;
        }
        catch (err) {
            logger.warn({ err, url }, 'Error parsing JSON');
            return undefined;
        }
    }
    catch (err) {
        logger.warn({ err, url }, 'Fetch error');
        return undefined;
    }
}

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
export const BATCH_SIZE = 25;
