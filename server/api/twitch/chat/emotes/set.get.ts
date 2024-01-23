import { z } from "zod";
const querySchema = z.object({
  emote_set_id: z.string(),
});

export default cachedEventHandler(
  async (event) => {
    const { emote_set_id: emoteSetId } = querySchema.parse(getQuery(event));
    const apiEmoteSet = await fetchEmoteSet(emoteSetId);
    return apiEmoteSet;
  },
  { maxAge: 60 * 15 /* 15 minutes */ },
);

type ApiTwitchGetEmoteSetResponse = {
  data: {
    id: string;
    name: string;
    images: {
      url_1x: string;
      url_2x: string;
      url_4x: string;
    };
    emote_type: "bitstier" | "follower" | "subscriptions";
    emote_set_id: string;
    owner_id: string;
    format: ["static"] | ["static", "animated"];
    scale: ("1.0" | "2.0" | "3.0")[];
    theme_mode: ["light" | "dark"][];
  };
  template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
};

function fetchEmoteSet(emoteSetId: string) {
  return twitchApi.fetch<ApiTwitchGetEmoteSetResponse>("/chat/emotes/set", {
    query: { emote_set_id: emoteSetId },
  });
}
