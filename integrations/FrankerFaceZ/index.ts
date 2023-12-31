import type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";

export function FFZEmoteString(emote: FrankerFaceZEmote) {
  return `<span class="inline-block" title="${emote.token} emote from FrankerFaceZ"><img src="https:${emote.url}/1" loading="lazy"></span>`;
}

export type { FrankerFaceZSet } from "./entity/FrankerFaceZSet";
export { createFFZGlobalCollection } from "./entity/createFFZGlobalCollection";
export { createFFZUserCollection } from "./entity/createFFZUserCollection";
export { createFFZUserSets } from "./entity/createFFZUserSets";
export { createFFZPartialUserCollection } from "./entity/createFFZPartialUserCollection";
