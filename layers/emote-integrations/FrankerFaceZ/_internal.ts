import { consola } from "consola";
import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "~/integrations/_internal";
import { assert } from "~/utils/error";
import { isLowercase } from "~/utils/string";
import { isNotNullable, isStringifiedNumber } from "~/utils/guard";
import type { TFrankerFaceZ } from "./types";

type MappedEmoteSet = Unwrap<
  Omit<IFrankerFaceZ.API.EmoteSet, "id"> & { id: `${number}` }
>;

export function makeOwner(
  profile: IFrankerFaceZ.API.UserStruct,
): TFrankerFaceZ.Person.IntegrationOwner {
  const { user, badges } = profile;
  if (user.emote_sets.length > 0) {
    consola.warn(
      "FrankerFaceZ API return user with non empty emote_sets array",
      user.emote_sets,
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
    pageAddress: `https://www.frankerfacez.com/channel/${profile.user.name}`,
  };
}

function makeEmoteRelatedPerson(person: IFrankerFaceZ.API.EmoteRelatedPerson) {
  const { name: login } = person;
  assert.ok(isLowercase(login));
  return {
    id: person._id.toString(),
    nickname: person.display_name,
    login,
  };
}

function makeEmote<TT extends TFrankerFaceZ.Emote>(
  emote: IFrankerFaceZ.API.Emote,
  type: TT["type"],
): TT {
  const id = emote.id.toString();
  assert.ok(isStringifiedNumber(id));
  return {
    id,
    isListed: emote.status === 1,
    isModifier: emote.modifier,
    isWrapper: emote.modifier_flags % 2 === 0,
    token: emote.name,
    url: `//cdn.frankerfacez.com/emote/${emote.id}/1`,
    width: emote.width,
    height: emote.height,
    source: "FrankerFaceZ",
    owner: emote.owner !== null && makeEmoteRelatedPerson(emote.owner),
    artist: emote.artist !== null && makeEmoteRelatedPerson(emote.artist),
    type,
  };
}

function makeMappedEmoteSet(set: IFrankerFaceZ.API.EmoteSet) {
  return {
    ...set,
    id: set.id.toString(),
  } as MappedEmoteSet;
}

function makeChannelEmote(emote: IFrankerFaceZ.API.Emote) {
  return makeEmote<TFrankerFaceZ.ChannelEmote>(emote, "channel");
}

export function makeChannelSets(
  setsRecord: IFrankerFaceZ.API.EmoteSetsRecord,
  capacity: number,
): TFrankerFaceZ.ChannelEmoteSet[] {
  return Object.values(setsRecord)
    .map(makeMappedEmoteSet)
    .map((set) => {
      return {
        name: set.title,
        id: set.id,
        type: "channel",
        source: "FrankerFaceZ",
        emotes: set.emoticons.map(makeChannelEmote),
        capacity,
      };
    });
}

function makeGlobalEmote(
  emote: IFrankerFaceZ.API.Emote,
): TFrankerFaceZ.GlobalEmote {
  return makeEmote<TFrankerFaceZ.GlobalEmote>(emote, "global");
}

function transformGlobalSet(set: MappedEmoteSet): TFrankerFaceZ.GlobalEmoteSet {
  return {
    name: set.title,
    id: set.id,
    type: "global",
    source: "FrankerFaceZ",
    emotes: set.emoticons.map(makeGlobalEmote),
  };
}

function makeSpecificEmote(emote: IFrankerFaceZ.API.Emote) {
  return makeEmote<TFrankerFaceZ.SpecificEmote>(emote, "specific");
}

function transformSpecificSet(
  set: MappedEmoteSet,
  twitchIds: number[],
): TFrankerFaceZ.SpecificEmoteSet {
  return {
    name: set.title,
    id: set.id,
    type: "specific",
    source: "FrankerFaceZ",
    emotes: set.emoticons.map(makeSpecificEmote),
    allowedTo: {
      twitchIds,
    },
  };
}

export const makeGlobalIntegration =
  defineGlobalIntegrationMaker<TFrankerFaceZ.Global.ReadyIntegration>(
    "FrankerFaceZ",
  );
export const makePersonIntegration =
  definePersonIntegrationMaker<TFrankerFaceZ.Person.ReadyIntegration>(
    "FrankerFaceZ",
  );

export function transformGlobalSets(response: IFrankerFaceZ.API.GlobalStruct) {
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
      consola.error(
        "FrankerFaceZ API returned data with different schema, internal code must be changed",
      );
    })
    .filter(isNotNullable);
}
