import type { FrankerFaceZGlobalCollection } from "./FrankerFaceZGlobalCollection";
import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export interface FrankerFaceZPartialUserCollection
  extends FrankerFaceZGlobalCollection {
  owner: FrankerFaceZCollectionOwner;
}

export class FFZPartialUserCollection
  implements FrankerFaceZPartialUserCollection
{
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(owner: FrankerFaceZCollectionOwner) {
    this.name = `FrankerFaceZ ${owner.displayName} Emotes Collection`;
    this.sets = [] as FrankerFaceZSet[];
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
    this.owner = owner;
  }
}
