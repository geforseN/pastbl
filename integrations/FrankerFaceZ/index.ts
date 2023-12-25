import type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";

export function FFZEmoteString(emote: FrankerFaceZEmote) {
  return `<span class="inline-block" title="${emote.token} emote from FrankerFaceZ"><img src="https:${emote.url}/1" loading="lazy"></span>`;
}

export type { FrankerFaceZGlobalCollection } from "./entity/FrankerFaceZGlobalCollection";
export type { FrankerFaceZUserIntegration } from "./entity/FrankerFaceZUserIntegration";
export type { FrankerFaceZSet } from "./entity/FrankerFaceZSet";
export type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";
export { createFFZGlobalCollection } from "./entity/createFFZGlobalCollection";
export { createFFZUserIntegration } from "./entity/createFFZUserIntegration";
export { createFFZUserSets } from "./entity/createFFZUserSets";
export { createFFZPartialUserIntegration } from "./entity/createFFZPartialUserIntegration";
