import type {
  InternalGlobalEmoteCollection,
  IEmote,
  IEmoteSet,
} from "~/integrations";

type TwitchApiGlobalEmote = {
  format: ["static", "animated"] | ["static"];
  id: string;
  images: {
    url_1x: string; // `https://static-cdn.jtvnw.net/emoticons/v2/${TwitchApiGlobalEmote["id"]}/${TwitchApiGlobalEmote["format"][number]}/${TwitchApiGlobalEmote["theme_mode"][number]}/'1.0'`;
    url_2x: string;
    url_4x: string;
  };
  name: string;
  scale: ["1.0", "2.0", "3.0"];
  theme_mode: ["light", "dark"];
};

export interface ITwitchGlobalEmote extends IEmote {
  source: "Twitch";
  width: number;
  height: number;
}

export interface ITwitchGlobalEmoteResponse {
  data: TwitchApiGlobalEmote[];
  template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
}

export function TwitchEmoteString(emote: ITwitchGlobalEmote) {
  return `<span class="inline-block" title="${emote.token} emote from Twitch"><img src="${emote.url}" loading="lazy"></span>`;
}

class TwitchGlobalEmote implements ITwitchGlobalEmote {
  id;
  isAnimated;
  isListed;
  isModifier;
  isWrapper;
  source;
  token;
  url;
  width;
  height;

  constructor(apiEmote: TwitchApiGlobalEmote) {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.format.includes("animated");
    this.isListed = true;
    this.isModifier = false;
    this.isWrapper = false;
    this.source = "Twitch" as const;
    this.token = apiEmote.name;
    this.url = apiEmote.images.url_1x;
    // LINK: https://dev.twitch.tv/docs/api/reference/#get-global-emotes
    // NOTE: look for Response Body data.images url_(1 | 2 | 4)x
    this.width = 28;
    this.height = 28;
  }
}
interface ITwitchGlobalEmoteSet
  extends IEmoteSet<"Twitch", ITwitchGlobalEmote> {}

export interface ITwitchGlobalCollection
  extends InternalGlobalEmoteCollection<"Twitch", ITwitchGlobalEmoteSet> {}

function getTwitchGlobalEmoteSet(
  response: ITwitchGlobalEmoteResponse,
): ITwitchGlobalEmoteSet {
  return {
    id: "twitch:global",
    name: "Twitch Global Emotes Collection",
    source: "Twitch",
    updatedAt: Date.now(),
    emotes: response.data.map((emote) => new TwitchGlobalEmote(emote)),
  };
}

export function makeTwitchGlobalCollection(
  response: ITwitchGlobalEmoteResponse,
): ITwitchGlobalCollection {
  const set = getTwitchGlobalEmoteSet(response);
  return new TwitchGlobalCollection([set]);
}

export class TwitchGlobalCollection implements ITwitchGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: ITwitchGlobalEmoteSet[]) {
    this.name = "Twitch Global Emotes Collection" as const;
    this.sets = sets;
    this.source = "Twitch" as const;
    this.updatedAt = Date.now();
  }
}
