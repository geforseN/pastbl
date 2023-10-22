import type { EmoteCollection } from "~/integrations";
import type { FFZSet, FrankerFaceZSet } from "./FrankerFaceZSet";

export interface FrankerFaceZCollection extends EmoteCollection<FFZSet> {
  source: "FrankerFaceZ";
}

export class FFZCollection implements FrankerFaceZCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(name: string, sets: FrankerFaceZSet[]) {
    this.name = name;
    this.sets = sets;
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
  }
}
