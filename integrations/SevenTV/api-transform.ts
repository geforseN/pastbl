import { consola } from "consola";
import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import type { API } from "./api-types";

function defineEmoteMaker(type: string) {
  return function (emote: API.Emote) {
    const {
      data: { tags, host, listed, animated },
      id,
      flags,
      name,
      actor_id: actorId,
    } = emote;
    const { width, height } = host.files[1];
    consola.info(
      "SevenTV emote transform",
      host.url,
      host.files.map(Object.keys),
    );
    return {
      id,
      token: name,
      tags,
      isAnimated: animated,
      isListed: listed,
      isModifier: flags !== 0,
      isWrapper: flags === 1,
      actorId,
      width,
      height,
      source: "SevenTV" as const,
      type,
      url: `https://cdn.7tv.app/emote/${id}/1x.webp` as const,
    };
  };
}

function defineEmoteSetMaker(type: string) {
  const makeEmote = defineEmoteMaker(type);

  return function (set: API.EmoteSetWithEmotes) {
    return {
      type,
      name: set.name,
      emotes: set.emotes.map(makeEmote),
      id: set.id,
      capacity: set.capacity,
    };
  };
}

export const makeGlobalSet = defineEmoteSetMaker("global");

export const makeGlobalIntegration = defineGlobalIntegrationMaker("SevenTV");

export const makeChannelSet = defineEmoteSetMaker("channel");

export const makePersonIntegration = definePersonIntegrationMaker("SevenTV");

export function makeOwner(profile: API.UserProfile) {
  return {
    id: profile.user.id,
    emoteCapacity: profile.emote_capacity,
    linkedAt: profile.linked_at,
    style: profile.user.style,
  };
}
