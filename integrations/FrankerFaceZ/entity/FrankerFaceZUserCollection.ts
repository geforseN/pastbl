import type { FrankerFaceZGlobalCollection } from "./FrankerFaceZGlobalCollection";
import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FFZPartialUserCollection } from "./FrankerFaceZPartialUserCollection";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export interface FrankerFaceZUserCollection
  extends FrankerFaceZGlobalCollection {
  owner: FrankerFaceZCollectionOwner;
}

export class FFZUserCollection implements FrankerFaceZUserCollection {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(
    partialCollection: FFZPartialUserCollection,
    sets: FrankerFaceZSet[],
  ) {
    this.name = partialCollection.name;
    this.sets = sets;
    this.source = partialCollection.source;
    this.updatedAt = Date.now();
    this.owner = partialCollection.owner;
  }
}
