import { isArray } from "../../../../../../../../app/utils/guards";
import { assert } from "../../../../../../../../app/utils/assert";
import type * as TSevenTV from "#t_seventv";

export async function fetchSevenTVGlobalEmotesSet() {
  const response = await fetch("https://7tv.io/v3/emote-sets/global");
  assert.response.ok(
    response,
    new Error("Failed to load SevenTV global emotes"),
  );
  const json = await response.json();
  assert.ok(isArray(json?.emotes));
  return json as TSevenTV.Api.SetWithEmotes;
}
