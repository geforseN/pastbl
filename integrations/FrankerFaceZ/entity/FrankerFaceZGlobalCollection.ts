import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface FrankerFaceZGlobalCollection
  extends InternalGlobalEmoteCollection<"FrankerFaceZ", FrankerFaceZSet> {}

export class FFZGlobalCollection implements FrankerFaceZGlobalCollection {
  sets;
  source = "FrankerFaceZ" as const;
  formedAt = Date.now();

  constructor(sets: FrankerFaceZSet[]) {
    this.sets = sets;
  }
}
