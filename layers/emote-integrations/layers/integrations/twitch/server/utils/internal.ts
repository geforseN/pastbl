import type { TTwitch } from "#t_twitch";
import type { TwitchApi } from "#integrations_twitch/api-types";

export function getTwitchEmoteSetName(emote: {
  emote_type: "bitstier" | "follower" | "subscriptions";
  tier: string;
}) {
  switch (emote.emote_type) {
    case "bitstier": {
      return `Bits emotes`;
    }
    case "follower": {
      return `Follower emotes`;
    }
    case "subscriptions": {
      const tier = Number(emote.tier) / 1000;
      assert.ok(!Number.isNaN(tier));
      return `Subscriber emotes - tier ${tier}`;
    }
    default: {
      throw new Error(`Unknown emote type: ${emote.emote_type}`);
    }
  }
}

export function makeTwitchEmote<T extends TTwitch.EmoteType>(
  emote: TwitchApi.ChatEmote | TwitchApi.GlobalEmote,
  type: T,
) {
  const isAnimated = emote.format.includes("animated");
  let url = emote.images.url_1x;
  if (isAnimated) {
    url = url.replace("/static/", "/animated/");
  }
  return {
    id: emote.id,
    token: emote.name,
    url,
    source: "Twitch" as const,
    type,
    isAnimated,
    isListed: true,
    isModifier: false,
    isWrapper: false,
    width: 28,
    height: 28,
  };
}
