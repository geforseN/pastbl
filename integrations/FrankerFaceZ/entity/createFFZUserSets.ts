import type { FrankerFaceZApiEmoteSet } from "../FrankerFaceZ.api";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZSet, type FrankerFaceZSet } from "./FrankerFaceZSet";

export function createFFZUserSets(
  apiSetsRecord: Record<`${number}`, FrankerFaceZApiEmoteSet>,
): FrankerFaceZSet[] {
  const apiSets = Object.values(apiSetsRecord);
  return apiSets.map(
    (apiSet) =>
      new FFZSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "channel")),
  );
}
