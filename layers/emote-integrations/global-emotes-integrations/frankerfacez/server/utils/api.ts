import type { FrankerFaceZApi } from "~~/layers/emote-integrations/integrations/frankerfacez/server/utils/api-types";

export async function getFrankerFaceZGlobalEmotes() {
  const response = await fetch(
    "https://api.frankerfacez.com/v1/set/global/ids",
  );
  assert.response.ok(response, "Failed to load FrankerFaceZ global emotes");
  const json = await response.json();
  return json as FrankerFaceZApi.GlobalStruct;
}