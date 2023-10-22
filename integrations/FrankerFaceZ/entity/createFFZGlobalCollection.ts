import type { fetchFFZGlobalEmoteSets } from "../FrankerFaceZ.api";
import {
  FFZCollection,
  type FrankerFaceZCollection,
} from "./FrankerFaceZCollection";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZSet } from "./FrankerFaceZSet";

export async function createFFZGlobalCollection(
  ffzGlobalSetsJson: Awaited<ReturnType<typeof fetchFFZGlobalEmoteSets>>,
): Promise<FrankerFaceZCollection> {
  const ffzSets = Object.values(ffzGlobalSetsJson.sets).map(
    (apiSet) =>
      new FFZSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "global")),
  );
  return new FFZCollection("FrankerFaceZ Global Emotes Collection", ffzSets);
}
