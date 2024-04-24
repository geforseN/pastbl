import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
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
  sets = [];
  source = "FrankerFaceZ" as const;
  formedAt = Date.now();
  owner;
  capacity;

  constructor(owner: FrankerFaceZCollectionOwner, capacity: number) {
    this.name = `${owner.displayName} Emotes` as const;
    this.owner = owner;
    this.capacity = capacity;
  }
}
