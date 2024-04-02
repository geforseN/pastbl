import { get7TVSetById, get7TVUserProfileByTwitchId } from "./SevenTV.api";
import type { I7TVEmote } from "./entity/SevenTVEmote";
import type { ISevenTVUserIntegration } from "./entity/SevenTVUserIntegration";
import { create7TVUserChannelSet } from "./entity/create7TVUserChannelSet";
import { create7TVUserIntegration } from "./entity/create7TVUserIntegration";
import { withLog } from "~/utils/dev-only";

function SevenTVEmoteString(emote: I7TVEmote) {
  return `<img data-token="${emote.token}" class="emote" src="${emote.url}" alt="${emote.token}" loading="lazy" width="${emote.width}">`;
}

export function SevenTVWrappedEmoteString(emote: I7TVEmote) {
  return `<span class="inline-block">${SevenTVEmoteString(emote)}</span>`;
}

export const SevenTV = {
  async giveUserIntegration(
    twitchId: TwitchUserId,
    twitchLogin?: Lowercase<string>,
  ) {
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
  async createUserIntegration(
    twitchId: TwitchUserId,
    twitchLogin?: Lowercase<string>,
  ): Promise<ISevenTVUserIntegration> {
    const integration = await this.giveUserIntegration(twitchId, twitchLogin);
    const activeSet = await this.giveActiveSet(integration);
    return {
      ...integration,
      sets: [activeSet],
    };
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
