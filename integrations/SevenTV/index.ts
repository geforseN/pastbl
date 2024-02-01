import { get7TVSetById, get7TVUserProfileByTwitchId } from "./SevenTV.api";
import type { I7TVEmote } from "./entity/SevenTVEmote";
import { create7TVUserChannelSet } from "./entity/create7TVUserChannelSet";
import { create7TVUserIntegration } from "./entity/create7TVUserIntegration";
import { withLog } from "~/utils/dev-only";

function getSevenTVEmoteTitle(emote: I7TVEmote) {
  return `${emote.token} emote from SevenTV`;
}

function SevenTVEmoteString(emote: I7TVEmote) {
  return `<img class="emote" src="${emote.url}" alt="${getSevenTVEmoteTitle(
    emote,
  )}" loading="lazy" width="${emote.width}">`;
}

export function SevenTVWrappedEmoteString(emote: I7TVEmote) {
  const aka = emote.originalName ? ` (aka ${emote.originalName})` : "";
  return `<span class="inline-block" title="${getSevenTVEmoteTitle(
    emote,
  )}${aka}">${SevenTVEmoteString(emote)}</span>`;
}

export const SevenTV = {
  async giveUserIntegration(twitchId: number, twitchLogin?: Lowercase<string>) {
    const profile = await get7TVUserProfileByTwitchId(twitchId, twitchLogin);
    return create7TVUserIntegration(profile);
  },
  async giveActiveSet(
    userIntegration: Awaited<ReturnType<typeof this.giveUserIntegration>>,
  ) {
    const { activeSet } = userIntegration;
    if (activeSet.isValid) {
      return withLog(activeSet, {
        logKey: "7TVSet",
        additionalMessages: { isFastReturn: true },
      });
    }
    const apiSet = await get7TVSetById(activeSet.id);
    return withLog(create7TVUserChannelSet(apiSet), {
      logKey: "7TVSet",
      additionalMessages: { isFastReturn: false },
    });
  },
};

export type { I7TVGlobalCollection } from "./entity/SevenTVGlobalCollection";
export type { ISevenTVUserIntegration } from "./entity/SevenTVUserIntegration";
export type { I7TVSet } from "./entity/SevenTVSet";
export type { I7TVEmote } from "./entity/SevenTVEmote";
export { create7TVGlobalCollection } from "./entity/create7TVGlobalCollection";
export { create7TVUserChannelSet } from "./entity/create7TVUserChannelSet";
export { create7TVUserIntegration } from "./entity/create7TVUserIntegration";
export { recreate7TVUserIntegration } from "./entity/recreate7TVUserIntegration";
