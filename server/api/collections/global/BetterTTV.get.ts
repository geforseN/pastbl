export default defineEventHandler(async () => {
  console.log("GET api/collections/global/BetterTTV");
  return await getBetterTTVGlobalCollection();
});
