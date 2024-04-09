import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface FrankerFaceZGlobalCollection
  extends InternalGlobalEmoteCollection<"FrankerFaceZ", FrankerFaceZSet> {}

export class FFZGlobalCollection implements FrankerFaceZGlobalCollection {
  name = "FrankerFaceZ Global Emotes Collection" as const;
  sets;
  source = "FrankerFaceZ" as const;
  formedAt = Date.now();

  constructor(sets: FrankerFaceZSet[]) {
    this.sets = sets;
  }
}
