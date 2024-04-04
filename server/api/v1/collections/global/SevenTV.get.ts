export default defineEventHandler(async () => {
  console.log("GET api/collections/global/SevenTV");
  return await getSevenTVGlobalCollection();
});
