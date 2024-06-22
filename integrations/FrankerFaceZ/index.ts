import { consola } from "consola";
import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import { api } from "./api";
import type {
  EmoteSet,
  UserStruct,
  GlobalStruct,
  Emote,
  EmoteRelatedPerson,
  EmoteSetsRecord,
} from "./api-types";
import { assert } from "~/utils/error";
import { isLowercase } from "~/utils/string";
import { isNotNullable } from "~/utils/guard";

type MappedEmoteSet = Unwrap<Omit<EmoteSet, "id"> & { id: `${number}` }>;

function makeOwner(profile: UserStruct) {
  const { user, badges } = profile;
  if (user.emote_sets.length > 0) {
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
  async getPersonIntegration(twitch: PersonTwitch) {
    const [profile, room] = await Promise.all([
      api.getPersonProfile(twitch.id, twitch.login),
      api.getPersonRoom(twitch.id),
    ]);
    const owner = makeOwner(profile);
    const sets = makeChannelSets(room.sets, profile.user.max_emoticons);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration() {
    const response = await api.getGlobalEmotes();
    const sets = transformGlobalSets(response);
    return makeGlobalIntegration(sets);
  },
};

function makeEmoteRelatedPerson(person: EmoteRelatedPerson) {
  const { name: login } = person;
  assert.ok(isLowercase(login));
  return {
    id: person._id.toString(),
    nickname: person.display_name,
    login,
  };
}

function makeEmote<E extends Emote>(
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

function makeMappedEmoteSet(set: EmoteSet) {
  return {
    ...set,
    id: set.id.toString(),
  } as MappedEmoteSet;
}

const makeChannelEmote = (emote: Emote) =>
  makeEmote(emote, { type: "channel" });

export function makeChannelSets(setsRecord: EmoteSetsRecord, capacity: number) {
  return Object.values(setsRecord)
    .map(makeMappedEmoteSet)
    .map((set) => {
      return {
        name: set.title,
        id: set.id,
        type: "global" as const,
        source: "FrankerFaceZ" as const,
        emotes: set.emoticons.map(makeChannelEmote),
        capacity,
      };
    });
}

const makeGlobalEmote = (emote: Emote) => makeEmote(emote, { type: "global" });

function transformGlobalSet(set: MappedEmoteSet) {
  return {
    name: set.title,
    id: set.id,
    type: "global" as const,
    source: "FrankerFaceZ" as const,
    emotes: set.emoticons.map(makeGlobalEmote),
  };
}

const makeSpecificEmote = (emote: Emote) =>
  makeEmote(emote, { type: "specific" });

function transformSpecificSet(set: MappedEmoteSet, twitchIds: number[]) {
  return {
    name: set.title,
    id: set.id,
    type: "specific" as const,
    source: "FrankerFaceZ" as const,
    emotes: set.emoticons.map(makeSpecificEmote),
    allowedTo: {
      twitchIds,
    },
  };
}

const makeGlobalIntegration = defineGlobalIntegrationMaker("FrankerFaceZ");
const makePersonIntegration = definePersonIntegrationMaker("FrankerFaceZ");

function transformGlobalSets(response: GlobalStruct) {
  const defaultEmoteSetsIds = new Set(response.default_sets.map(String));
  const specificEmoteSets = new Map(Object.entries(response.user_ids));
  return Object.values(response.sets)
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
