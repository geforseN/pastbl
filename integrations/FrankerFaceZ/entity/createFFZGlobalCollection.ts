import type { fetchFFZGlobalEmoteSets } from "../FrankerFaceZ.api";
import { FFZCollection } from "./FrankerFaceZCollection";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZEmoteSet } from "./FrankerFaceZSet";

export async function createFFZGlobalCollection(
  ffzGlobalSetsJson: Awaited<ReturnType<typeof fetchFFZGlobalEmoteSets>>,
) {
  const ffzSets = Object.values(ffzGlobalSetsJson.sets).map(
    (apiSet) =>
      new FFZEmoteSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "global")),
  );
  return new FFZCollection(ffzSets);
}
