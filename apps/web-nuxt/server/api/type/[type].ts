export default defineEventHandler(async (event) => {
    const type = getRouterParam(event, 'type');
    return $fetch(`http://localhost:8000/api/pokemon/types/${type}`);
});
