import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZPartialUserCollection } from "./FrankerFaceZPartialUserCollection";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { IEmoteCollection } from "~/integrations";

export interface FrankerFaceZUserCollection extends IEmoteCollection {
  owner: FrankerFaceZCollectionOwner;
}

export class FFZUserCollection implements FrankerFaceZUserCollection {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(
    partialCollection: FrankerFaceZPartialUserCollection,
    sets: FrankerFaceZSet[],
  ) {
    this.name = partialCollection.name;
    this.sets = sets;
    this.source = partialCollection.source;
    this.updatedAt = Date.now();
    this.owner = partialCollection.owner;
  }
}
