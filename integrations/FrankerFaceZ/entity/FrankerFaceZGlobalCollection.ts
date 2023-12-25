import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface FrankerFaceZGlobalCollection
  extends InternalGlobalEmoteCollection<"FrankerFaceZ", FrankerFaceZSet> {}

export class FFZGlobalCollection implements FrankerFaceZGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: FrankerFaceZSet[]) {
    this.name = "FrankerFaceZ Global Emotes Collection" as const;
    this.sets = sets;
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
  }
}
