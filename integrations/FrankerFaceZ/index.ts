import type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";

function getFFZEmoteTitle(emote: FrankerFaceZEmote) {
  return `${emote.token} emote from FrankerFaceZ`;
}

export function FFZEmoteString(emote: FrankerFaceZEmote) {
  return `<img src="https:${emote.url}/1" alt="${getFFZEmoteTitle(
    emote,
  )}" loading="lazy" width="${emote.width}">`;
}

export function FFZWrappedEmoteString(emote: FrankerFaceZEmote) {
  return `<span class="inline-block" title="${getFFZEmoteTitle}">${FFZEmoteString(
    emote,
  )}</span>`;
}

export type { FrankerFaceZGlobalCollection } from "./entity/FrankerFaceZGlobalCollection";
export type { FrankerFaceZUserIntegration } from "./entity/FrankerFaceZUserIntegration";
export type { FrankerFaceZSet } from "./entity/FrankerFaceZSet";
export type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";
export { createFFZGlobalCollection } from "./entity/createFFZGlobalCollection";
export { createFFZUserIntegration } from "./entity/createFFZUserIntegration";
export { createFFZUserSets } from "./entity/createFFZUserSets";
export { createFFZPartialUserIntegration } from "./entity/createFFZPartialUserIntegration";
