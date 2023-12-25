import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { FrankerFaceZUserIntegration } from "./FrankerFaceZUserIntegration";

export interface FrankerFaceZPartialUserIntegration
  extends FrankerFaceZUserIntegration {
  owner: FrankerFaceZCollectionOwner;
  capacity: number;
}

export class FFZPartialUserIntegration
  implements FrankerFaceZPartialUserIntegration
{
  name;
  sets;
  source;
  updatedAt;
  owner;
  capacity;

  constructor(owner: FrankerFaceZCollectionOwner, capacity: number) {
    this.name = `FrankerFaceZ ${owner.displayName} Emotes Collection` as const;
    this.sets = [] as FrankerFaceZSet[];
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
    this.owner = owner;
    this.capacity = capacity;
  }
}
