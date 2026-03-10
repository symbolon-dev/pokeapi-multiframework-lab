export default defineEventHandler(async (event) => {
    const { searchTerm } = getQuery(event);
    const name = String(searchTerm ?? '');

    return $fetch(`http://localhost:8000/api/pokemon?page=1&limit=5&name=${name}`);
});
