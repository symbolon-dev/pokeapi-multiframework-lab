export default defineEventHandler(async () => {
    try {
        return await $fetch('http://localhost:8000/api/pokemon/generations');
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
