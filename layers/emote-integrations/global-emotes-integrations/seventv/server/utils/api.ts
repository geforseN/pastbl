import type { SevenTVApi } from "$/emote-integrations/integrations/seventv/server/utils/api-types";

export async function fetchSevenTVGlobalEmotesSet() {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  assert.response.ok(
    response,
    new Error("Failed to load SevenTV global emotes"),
  );
  const json = await response.json();
  assert.ok(isArray(json?.emotes));
  return json as SevenTVApi.SetWithEmotes;
}
