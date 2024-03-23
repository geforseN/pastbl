import { z } from "zod";

const querySchema = z
  .object({
    broadcaster_id: z.string(),
  })
  .transform((query) => ({
    broadcasterId: query.broadcaster_id,
  }));

export default cachedEventHandler(
  async (event) => {
    const { broadcasterId } = querySchema.parse(getQuery(event));
    const apiChatEmotes = await fetchChatEmotes(broadcasterId);
    // TODO: here need to map emotes, emote must be ITwitchEmote extend IEmote
    return apiChatEmotes;
  },
  { maxAge: 60 * 15 },
);

export type ApiTwitchGetChatEmotesResponse = {
  data: {
    id: `${number}`;
    name: string;
    images: {
      url_1x: string;
      url_2x: string;
      url_4x: string;
    };
    // NOTE: tier field contains the tier information only if emote_type is set to subscriptions, otherwise, it’s an empty string.
    tier: string | "";
    emote_type: "bitstier" | "follower" | "subscriptions";
    emote_set_id: string;
    format: ["static"] | ["static", "animated"] | ["animated", "static"];
    scale: ("1.0" | "2.0" | "3.0")[];
    theme_mode: ["light" | "dark"][];
  }[];
  template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
};

function fetchChatEmotes(broadcasterId: string) {
  return twitchApi.fetch<ApiTwitchGetChatEmotesResponse>("/chat/emotes", {
    query: { broadcaster_id: broadcasterId },
  });
}
