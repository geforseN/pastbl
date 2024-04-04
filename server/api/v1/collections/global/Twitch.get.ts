export default defineEventHandler(async () => {
  console.log("GET api/collections/global/Twitch");
  return await getTwitchGlobalCollection();
});
