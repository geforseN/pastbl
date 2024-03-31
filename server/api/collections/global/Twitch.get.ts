import {
  ITwitchGlobalEmoteResponse,
  makeTwitchGlobalCollection,
} from "~/integrations/Twitch";

export async function getTwitchGlobalCollection() {
  const response = await twitchApi.fetch<ITwitchGlobalEmoteResponse>(
    "/chat/emotes/global",
  );
  return makeTwitchGlobalCollection(response);
}

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/Twitch");
  return await getTwitchGlobalCollection();
});
