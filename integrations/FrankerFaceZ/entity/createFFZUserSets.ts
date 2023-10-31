import type { FrankerFaceZApiEmoteSet } from "../FrankerFaceZ.api";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZSet, type FrankerFaceZSet } from "./FrankerFaceZSet";

export function createFFZUserSets(
  apiSets: Record<`${number}`, FrankerFaceZApiEmoteSet>,
): FrankerFaceZSet[] {
  return Object.values(apiSets).map(
    (apiSet) =>
      new FFZSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "channel")),
  );
}
