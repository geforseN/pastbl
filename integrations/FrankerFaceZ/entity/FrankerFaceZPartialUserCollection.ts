import type { FrankerFaceZGlobalCollection } from "./FrankerFaceZGlobalCollection";
import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export interface FrankerFaceZPartialUserCollection
  extends FrankerFaceZGlobalCollection {
  owner: FrankerFaceZCollectionOwner;
  capacity: number;
}

export class FFZPartialUserCollection
  implements FrankerFaceZPartialUserCollection
{
  name;
  sets;
  source;
  updatedAt;
  owner;
  capacity;

  constructor(owner: FrankerFaceZCollectionOwner, capacity: number) {
    this.name = `FrankerFaceZ ${owner.displayName} Emotes Collection`;
    this.sets = [] as FrankerFaceZSet[];
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
    this.owner = owner;
    this.capacity = capacity;
  }
}
