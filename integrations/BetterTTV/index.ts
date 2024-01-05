import type { BetterTTVEmote } from "./entity/BetterTTVEmote";

function getBTTVEmoteTitle(emote: BetterTTVEmote) {
  return `${emote.token} emote from BetterTTV`;
}

export function BTTVEmoteString(emote: BetterTTVEmote) {
  return `<img src="https:${emote.url}/1x.webp" alt="${getBTTVEmoteTitle(
    emote,
  )}" loading="lazy">`;
}

export function BTTVWrappedEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${getBTTVEmoteTitle(
    emote,
  )}">${BTTVEmoteString(emote)}</span>`;
}

export type { BetterTTVGlobalCollection } from "./entity/BetterTTVGlobalCollection";
export type { BetterTTVUserIntegration } from "./entity/BetterTTVUserIntegration";
export type { BetterTTVSet } from "./entity/BetterTTVSet";
export type { BetterTTVEmote } from "./entity/BetterTTVEmote";
export { createBTTVGlobalCollection } from "./entity/createBTTVGlobalCollection";
export { createBTTVUserIntegration } from "./entity/createBTTVUserIntegration";
