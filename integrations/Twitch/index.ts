import type {
  InternalGlobalEmoteCollection,
  IEmote,
  IEmoteSet,
  InternalUserEmoteIntegration,
  IEmoteCollectionOwner,
} from "~/integrations";

type TwitchApiGlobalEmote = {
  // MOTE: 'static' is always included (for now), animated is optional
  format: ("animated" | "static")[];
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

export interface ITwitchEmote extends IEmote {
  source: "Twitch";
  width: number;
  height: number;
}

export interface ITwitchGlobalEmoteResponse {
  data: TwitchApiGlobalEmote[];
  template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
}
function getTwitchEmoteTitle(emote: ITwitchEmote) {
  return `${emote.token} emote from Twitch`;
}

export function TwitchEmoteString(emote: ITwitchEmote) {
  return `<img src="${emote.url}" alt="${getTwitchEmoteTitle(
    emote,
  )}" loading="lazy">`;
}

export function TwitchWrappedEmoteString(emote: ITwitchEmote) {
  return `<span class="inline-block" title="${getTwitchEmoteTitle(
    emote,
  )}">${TwitchEmoteString(emote)}</span>`;
}

class TwitchGlobalEmote implements ITwitchEmote {
  id;
  isAnimated;
  token;
  url;

  isListed = true;
  isModifier = false;
  isWrapper = false;
  source = "Twitch" as const;
  // LINK: https://dev.twitch.tv/docs/api/reference/#get-global-emotes
  // NOTE: width and height are taken from Response Body data.images.url_1x
  width = 28;
  height = 28;

  constructor(apiEmote: TwitchApiGlobalEmote) {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.format.includes("animated");
    this.token = apiEmote.name;
    this.url = apiEmote.images.url_1x;
    if (this.isAnimated) {
      this.url = this.url.replace("/static/", "/animated/") as string;
    }
  }
}
interface ITwitchGlobalEmoteSet extends IEmoteSet<"Twitch", ITwitchEmote> {}

export interface ITwitchGlobalCollection
  extends InternalGlobalEmoteCollection<"Twitch", ITwitchGlobalEmoteSet> {}

function getTwitchGlobalEmoteSet(
  response: ITwitchGlobalEmoteResponse,
): ITwitchGlobalEmoteSet {
  return {
    id: "twitch:global",
    name: "Global Emotes",
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

interface ITwitchCollectionOwner extends IEmoteCollectionOwner {}

interface ITwitchEmoteSet extends IEmoteSet<"Twitch", ITwitchEmote> {}

export interface ITwitchUserIntegration
  extends InternalUserEmoteIntegration<
    "Twitch",
    ITwitchEmoteSet,
    ITwitchCollectionOwner
  > {}
