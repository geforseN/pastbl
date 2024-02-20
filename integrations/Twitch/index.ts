import type {
  InternalGlobalEmoteCollection,
  IEmote,
  IEmoteSet,
  InternalUserEmoteIntegration,
  IEmoteCollectionOwner,
} from "~/integrations";
import type { ApiTwitchGetChatEmotesResponse } from "~/server/api/twitch/chat/emotes/index.get";
import type { TwitchUser } from "~/server/api/twitch/users/[login].get";

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
  type: "global" | "channel";
  width: number;
  height: number;
}

export interface ITwitchGlobalEmoteResponse {
  data: TwitchApiGlobalEmote[];
  template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
}

class TwitchEmote implements ITwitchEmote {
  id;
  isAnimated;
  token;
  url;

  isListed = true;
  isModifier = false;
  isWrapper = false;
  source = "Twitch" as const;
  type: "global" | "channel";
  // LINK: https://dev.twitch.tv/docs/api/reference/#get-global-emotes
  // NOTE: width and height are taken from Response Body data.images.url_1x
  width = 28;
  height = 28;

  constructor(apiEmote: TwitchApiGlobalEmote, type: "global" | "channel") {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.format.includes("animated");
    this.token = apiEmote.name;
    this.url = apiEmote.images.url_1x;
    this.type = type;
    if (this.isAnimated) {
      this.url = this.url.replace("/static/", "/animated/") as string;
    }
  }
}
export interface ITwitchEmoteSet extends IEmoteSet<"Twitch", ITwitchEmote> {}
export interface ITwitchGlobalCollection
  extends InternalGlobalEmoteCollection<"Twitch", ITwitchEmoteSet> {}

function getTwitchGlobalEmoteSet(
  response: ITwitchGlobalEmoteResponse,
): ITwitchEmoteSet {
  return {
    id: "twitch:global",
    name: "Global Emotes",
    source: "Twitch",
    updatedAt: Date.now(),
    emotes: response.data.map((emote) => new TwitchEmote(emote, "global")),
  };
}

const userEmoteProto = {
  height: 28,
  width: 28,
  source: "Twitch",
  isModifier: false,
  isWrapper: false,
  isListed: true,
} as const satisfies Partial<ITwitchEmote>;

function createUserEmote2(
  apiEmote: ApiTwitchGetChatEmotesResponse["data"][number],
  url: string,
): ITwitchEmote {
  return Object.create(userEmoteProto, {
    id: { value: apiEmote.id },
    token: { value: apiEmote.name },
    url: { value: url },
    isAnimated: { value: apiEmote.format === "animated" },
  });
}

export function createUserEmote(
  apiEmote: ApiTwitchGetChatEmotesResponse["data"][number],
  url: string,
): ITwitchEmote {
  return {
    ...userEmoteProto,
    url,
    type: "channel",
    id: apiEmote.id,
    token: apiEmote.name,
    isAnimated: apiEmote.format.includes("animated"),
  };
}

function getTwitchUserEmoteSet(
  response: ApiTwitchGetChatEmotesResponse,
): ITwitchEmoteSet {
  return {
    id: "twitch:global",
    name: `Channel emotes`,
    source: "Twitch",
    updatedAt: Date.now(),
    emotes: response.data.map((emote) => new TwitchEmote(emote, "channel")),
  };
}

export function getTwitchUserIntegration(
  apiChatEmotes: ApiTwitchGetChatEmotesResponse,
) {
  return apiChatEmotes;
}

export function makeTwitchGlobalCollection(
  response: ITwitchGlobalEmoteResponse,
): ITwitchGlobalCollection {
  const set = getTwitchGlobalEmoteSet(response);
  return new TwitchGlobalCollection([set]);
}

export class TwitchGlobalCollection implements ITwitchGlobalCollection {
  name = "Twitch Global Emotes Collection" as const;
  source = "Twitch" as const;
  sets;
  updatedAt;

  constructor(sets: ITwitchEmoteSet[]) {
    this.sets = sets;
    this.updatedAt = Date.now();
  }
}

interface ITwitchCollectionOwner extends IEmoteCollectionOwner {}

export interface ITwitchUserIntegration
  extends InternalUserEmoteIntegration<
    "Twitch",
    ITwitchEmoteSet,
    ITwitchCollectionOwner
  > {}

export function createUserIntegration(
  twitchUser: Pick<TwitchUser, "id" | "login" | "nickname">,
  sets: ITwitchEmoteSet[],
): ITwitchUserIntegration {
  return {
    name: `Twitch ${twitchUser.nickname} Emotes Integration`,
    source: "Twitch",
    sets,
    owner: {
      twitch: {
        user: twitchUser,
      },
    },
    updatedAt: Date.now(),
  };
}
