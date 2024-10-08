// LINK: https://betterttv.com/developers/api#global-emotes
export async function fetchBetterTTVGlobalEmotes() {
  const response = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global",
  );
  assert.response.ok(response, "Failed to load BetterTTV global emotes");
  const json = await response.json();
  return json as TBetterTTV.Api.GlobalEmote[];
}
