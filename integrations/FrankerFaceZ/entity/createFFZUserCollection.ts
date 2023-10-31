import {
  FFZUserCollection,
  type FrankerFaceZUserCollection,
} from "./FrankerFaceZUserCollection";
import { type FrankerFaceZPartialUserCollection } from "./FrankerFaceZPartialUserCollection";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export function createFFZUserCollection(
  partialCollection: FrankerFaceZPartialUserCollection,
  sets: FrankerFaceZSet[],
): FrankerFaceZUserCollection {
  return new FFZUserCollection(partialCollection, sets);
}
