export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (id === undefined || id === null || id.trim() === '') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Pokemon ID is required',
        });
    }
    try {
        return await $fetch(`http://localhost:8000/api/pokemon/${id}`);
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
