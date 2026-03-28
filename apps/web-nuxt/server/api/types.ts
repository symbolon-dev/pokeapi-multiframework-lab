export default defineEventHandler(async () => {
    return $fetch('http://localhost:8000/api/pokemon/types');
});
