function toParamTuples(key: string, value: unknown): [string, string][] {
    if (Array.isArray(value))
        return value.map(v => [key, String(v)]);
    if (value !== undefined && value !== '')
        return [[key, String(value)]];
    return [];
}

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const params = new URLSearchParams(
            Object.entries(query).flatMap(([key, value]) => toParamTuples(key, value)),
        );
        return await $fetch(`http://localhost:8000/api/pokemon?${params.toString()}`);
    }
    catch (error: unknown) {
        const err = error as { statusCode?: number; status?: number; statusMessage?: string; message?: string };
        const status = err?.statusCode ?? err?.status ?? 500;
        const message = err?.statusMessage ?? err?.message ?? 'Internal Server Error';
        throw createError({
            statusCode: status,
            statusMessage: message,
        });
    }
});
