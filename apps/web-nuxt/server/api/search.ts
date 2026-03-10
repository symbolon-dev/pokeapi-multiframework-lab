export default defineEventHandler(async () => {
    return $fetch('http://localhost:8000/api/pokemon?page=1&limit=5');
});
