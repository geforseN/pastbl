import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { EmoteCollection } from "~/integrations";

export interface FrankerFaceZGlobalCollection
  extends EmoteCollection<FrankerFaceZSet> {
  source: "FrankerFaceZ";
}

export class FFZGlobalCollection implements FrankerFaceZGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: FrankerFaceZSet[]) {
    this.name = "FrankerFaceZ Global Emotes Collection";
    this.sets = sets;
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
  }
}
