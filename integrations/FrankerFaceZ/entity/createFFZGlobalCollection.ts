import type { getFFZGlobalEmoteSets } from "../FrankerFaceZ.api";
import {
  FFZGlobalCollection,
  type FrankerFaceZGlobalCollection,
} from "./FrankerFaceZGlobalCollection";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZSet } from "./FrankerFaceZSet";

export function createFFZGlobalCollection(
  ffzGlobalSetsJson: Awaited<ReturnType<typeof getFFZGlobalEmoteSets>>,
): FrankerFaceZGlobalCollection {
  const ffzSets = Object.values(ffzGlobalSetsJson.sets).map(
    (apiSet) =>
      new FFZSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "global")),
  );
  return new FFZGlobalCollection(ffzSets);
}
