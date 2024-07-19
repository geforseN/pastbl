import { assert } from "~/utils/assert";
import { isArray } from "~/utils/guard";

export async function getGlobalEmotesSet() {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  assert.response.ok(
    response,
    new Error("Failed to load SevenTV global emotes"),
  );
  const json = await response.json();
  assert.ok(isArray(json?.emotes));
  return json as ISevenTV.API.SetWithEmotes;
}
