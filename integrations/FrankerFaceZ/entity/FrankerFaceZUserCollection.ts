import type { FrankerFaceZCollection } from "./FrankerFaceZCollection";
import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export interface FrankerFaceZUserCollection extends FrankerFaceZCollection {
  owner: FrankerFaceZCollectionOwner;
}

export class FFZUserCollection implements FrankerFaceZUserCollection {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(sets: FrankerFaceZSet[], owner: FrankerFaceZCollectionOwner) {
    this.name = `FrankerFaceZ ${owner.displayName} Emotes Collection`;
    this.sets = sets;
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
    this.owner = owner;
  }
}
