function toParamTuples(key: string, value: unknown): [string, string][] {
    if (Array.isArray(value))
        return value.map(v => [key, String(v)]);
    if (value !== undefined && value !== '')
        return [[key, String(value)]];
    return [];
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const params = new URLSearchParams(
        Object.entries(query).flatMap(([key, value]) => toParamTuples(key, value)),
    );
    return $fetch(`http://localhost:8000/api/pokemon?${params.toString()}`);
});
