import type { FrankerFaceZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import type { FrankerFaceZPartialUserIntegration } from "./FrankerFaceZPartialUserIntegration";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";
import type { InternalUserEmoteIntegration } from "~/integrations";

export interface FrankerFaceZUserIntegration
  extends InternalUserEmoteIntegration<
    "FrankerFaceZ",
    FrankerFaceZSet,
    FrankerFaceZCollectionOwner
  > {}

export class FFZUserIntegration implements FrankerFaceZUserIntegration {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(
    partialCollection: FrankerFaceZPartialUserIntegration,
    sets: FrankerFaceZSet[],
  ) {
    this.name = partialCollection.name;
    this.sets = sets;
    this.source = partialCollection.source;
    this.updatedAt = Date.now();
    this.owner = partialCollection.owner;
  }
}
