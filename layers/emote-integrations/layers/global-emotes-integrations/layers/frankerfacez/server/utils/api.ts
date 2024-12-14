import { assert } from "~/utils/assert";

export async function getFrankerFaceZGlobalEmotes() {
  const response = await fetch(
    "https://api.frankerfacez.com/v1/set/global/ids",
  );
  assert.response.ok(response, "Failed to load FrankerFaceZ global emotes");
  const json = await response.json();
  return json as TFrankerFaceZ.Api.GlobalStruct;
}
