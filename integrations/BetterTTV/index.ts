import type { BetterTTVEmote } from "./entity/BetterTTVEmote";

export function BTTVEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${emote.token} emote from BetterTTV"><img src="https:${emote.url}/1x.webp" loading="lazy"></span>`;
}

export type { BetterTTVGlobalCollection } from "./entity/BetterTTVGlobalCollection";
export type { BetterTTVUserIntegration } from "./entity/BetterTTVUserIntegration";
export type { BetterTTVSet } from "./entity/BetterTTVSet";
export type { BetterTTVEmote } from "./entity/BetterTTVEmote";
export { createBTTVGlobalCollection } from "./entity/createBTTVGlobalCollection";
export { createBTTVUserIntegration } from "./entity/createBTTVUserIntegration";
