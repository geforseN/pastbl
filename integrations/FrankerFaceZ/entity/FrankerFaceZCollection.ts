import type { FrankerFaceZEmoteSet } from "./FrankerFaceZSet";

export class FFZCollection {
  name;
  updatedAt;
  sets;

  constructor(sets: FrankerFaceZEmoteSet[]) {
    this.name = "FrankerFaceZ";
    this.updatedAt = Date.now();
    this.sets = sets;
  }
}
