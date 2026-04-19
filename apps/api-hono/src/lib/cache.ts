const store = new Map<string, unknown>();

export function cacheGet<T>(key: string): T | undefined {
    return store.get(key) as T | undefined;
}

export function cacheSet<T>(key: string, data: T): void {
    store.set(key, data);
}
