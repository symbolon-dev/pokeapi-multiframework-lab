export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    return $fetch(`http://localhost:8000/api/pokemon/${id}`);
});
