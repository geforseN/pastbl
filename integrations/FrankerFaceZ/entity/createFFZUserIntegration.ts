import {
  FFZUserIntegration,
  type FrankerFaceZUserIntegration,
} from "./FrankerFaceZUserIntegration";
import { type FrankerFaceZPartialUserIntegration } from "./FrankerFaceZPartialUserIntegration";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export function createFFZUserIntegration(
  partialCollection: FrankerFaceZPartialUserIntegration,
  sets: FrankerFaceZSet[],
): FrankerFaceZUserIntegration {
  return new FFZUserIntegration(partialCollection, sets);
}
