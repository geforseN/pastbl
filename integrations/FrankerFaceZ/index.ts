import { consola } from "consola";
import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import { api } from "./api";
import type { API } from "./api-types";

type MappedEmoteSet = Unwrap<Omit<API.EmoteSet, "id"> & { id: `${number}` }>;

function makeOwner(profile: API.UserStruct) {
  const { user, badges } = profile;
  if (user.emote_sets.length) {
    consola.warn(
      "FrankerFaceZ API return user with non empty emote_sets array",
    );
  }
  return {
    id: user.id,
    twitchId: user.twitch_id,
    youtubeId: user.youtube_id,
    avatarUrl: user.avatar,
    isDonor: user.is_donor,
    isSubWoofer: user.is_subwoofer,
    capacity: user.max_emoticons,
    emoteSetsIds: user.emote_sets,
    badges: Object.values(badges).map((badge) => ({
      id: badge.id,
      name: badge.name,
      title: badge.title,
      color: badge.color,
      url: badge.image,
    })),
    pageAddress: "https://www.frankerfacez.com/channel/" + profile.user.name,
  };
}

export const FrankerFaceZ = {
  async getPersonIntegration(twitch: TwitchUser) {
    const [profile, room] = await Promise.all([
      api.getPersonProfile(twitch.id, twitch.login),
      api.getPersonRoom(twitch.id),
    ]);
    const owner = makeOwner(profile);
    const sets = makeChannelSets(room.sets, profile.user.max_emoticons);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration() {
    const res = await api.getGlobalEmotes();
    const sets = transformGlobalSets(res);
    return makeGlobalIntegration(sets);
  },
};

function makeEmoteRelatedPerson(person: API.EmoteRelatedPerson) {
  const { name: login } = person;
  assert.ok(isLowercase(login));
  return {
    id: person._id.toString(),
    nickname: person.display_name,
    login,
  };
}

function makeEmote<E extends API.Emote>(
  emote: E,
  additional: { type: string } & Record<string, unknown>,
) {
  return {
    id: emote.id.toString(),
    isListed: emote.status === 1,
    isModifier: emote.modifier,
    isWrapper: emote.modifier_flags % 2 === 0,
    token: emote.name,
    url: `//cdn.frankerfacez.com/emote/${emote.id}/1` as const,
    width: emote.width,
    height: emote.height,
    source: "FrankerFaceZ",
    owner: emote.owner && makeEmoteRelatedPerson(emote.owner),
    artist: emote.artist && makeEmoteRelatedPerson(emote.artist),
    ...additional,
  };
}

function makeMappedEmoteSet(set: API.EmoteSet) {
  return {
    ...set,
    id: set.id.toString(),
  } as MappedEmoteSet;
}

const makeChannelEmote = (emote: API.Emote) =>
  makeEmote(emote, { type: "channel" });

export function makeChannelSets(
  setsRecord: API.EmoteSetsRecord,
  capacity: number,
) {
  return Object.values(setsRecord)
    .map(makeMappedEmoteSet)
    .map((set) => {
      return {
        name: set.title,
        id: set.id,
        type: "global" as const,
        emotes: set.emoticons.map(makeChannelEmote),
        capacity,
      };
    });
}

const makeGlobalEmote = (emote: API.Emote) =>
  makeEmote(emote, { type: "global" });

function transformGlobalSet(set: MappedEmoteSet) {
  return {
    name: set.title,
    id: set.id,
    type: "global" as const,
    emotes: set.emoticons.map(makeGlobalEmote),
  };
}

const makeSpecificEmote = (emote: API.Emote) =>
  makeEmote(emote, { type: "specific" });

function transformSpecificSet(set: MappedEmoteSet, twitchIds: number[]) {
  return {
    name: set.title,
    id: set.id,
    type: "specific" as const,
    emotes: set.emoticons.map(makeSpecificEmote),
    allowedTo: {
      twitchIds,
    },
  };
}

const makeGlobalIntegration = defineGlobalIntegrationMaker("FrankerFaceZ");
const makePersonIntegration = definePersonIntegrationMaker("FrankerFaceZ");

function transformGlobalSets(res: API.GlobalStruct) {
  const defaultEmoteSetsIds = new Set(res.default_sets.map(String));
  const specificEmoteSets = new Map(Object.entries(res.user_ids));
  return Object.values(res.sets)
    .map(makeMappedEmoteSet)
    .map((set) => {
      if (defaultEmoteSetsIds.has(set.id)) {
        return transformGlobalSet(set);
      }
      const twitchIds = specificEmoteSets.get(set.id);
      if (twitchIds) {
        return transformSpecificSet(set, twitchIds);
      }
      return consola.error(
        "FrankerFaceZ API returned data with different schema, internal code must be changed",
      );
    })
    .filter(isNotNullable);
}
