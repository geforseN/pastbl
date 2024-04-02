import type {
  InternalGlobalEmoteCollection,
  IEmote,
  IEmoteSet,
  InternalUserEmoteIntegration,
  IEmoteCollectionOwner,
} from "~/integrations";
import type { TwitchApi } from "~/server/utils/twitch/twitch-api.types";
import { groupBy, objectEntries } from "~/utils/object";
import { assert } from "~/utils/error";

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

export function createUserEmote(
  apiEmote: TwitchApi["getChatEmotes"]["responseItem"],
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

const twitchTypeRecord = {
  bitstier: "Bits emotes",
  follower: "Follower emotes",
  subscriptions: "Subscriber emotes",
} as const;

function makeTwitchKey(
  emoteType: "bitstier" | "follower" | "subscriptions",
  emoteTier: string,
  emoteSetId: string,
) {
  const type = twitchTypeRecord[emoteType];
  if (type !== "Subscriber emotes") {
    return type + ":" + emoteSetId;
  }
  const tier = Number(emoteTier) / 1000;
  assert.ok(!Number.isNaN(tier));
  return `${type} - tier ${tier}` + ":" + emoteSetId;
}

export function makeUserTwitchIntegration(
  apiEmotes: TwitchApi["getChatEmotes"]["responseItem"][],
  user: TwitchUser,
) {
  const groupedEmotes = groupBy(
    apiEmotes,
    (emote) => makeTwitchKey(emote.emote_type, emote.tier, emote.emote_set_id),
    (emote): ITwitchEmote => {
      const url = emote.format.includes("animated")
        ? emote.images.url_1x.replace("/static/", "/animated/")
        : emote.images.url_1x;
      return createUserEmote(emote, url);
    },
  );
  const sets: ITwitchUserIntegration["sets"] = objectEntries(groupedEmotes).map(
    ([key, emotes]) => {
      assert.ok(typeof key === "string");
      const [name, id] = key.split(":");
      return {
        id,
        name,
        source: "Twitch",
        updatedAt: Date.now(),
        emotes,
      };
    },
  );
  const reducedSetsRecord = sets.reduce(
    (acc, set) => {
      if (!Object.hasOwn(acc, set.name)) {
        acc[set.name] = set;
        return acc;
      }
      const existing = acc[set.name];
      existing.updatedAt = Math.max(existing.updatedAt, set.updatedAt);
      existing.emotes.push(...set.emotes);
      existing.id += `+${set.id}`;
      return acc;
    },
    {} as Record<string, ITwitchUserIntegration["sets"][number]>,
  );
  const reducedSets = Object.values(reducedSetsRecord);
  const integration = createUserIntegration(user, reducedSets);
  return integration;
}
