export default defineEventHandler(async () => {
  console.log("GET api/collections/global/FrankerFaceZ");
  return await getFrankerFaceZGlobalCollection();
});
