import {
  FFZUserCollection,
  type FrankerFaceZUserCollection,
} from "./FrankerFaceZUserCollection";
import { FFZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import { FFZUserBadge } from "./FrankerFaceZUserBadge";
import {
  FFZPartialUserCollection,
  type FrankerFaceZPartialUserCollection,
} from "./FrankerFaceZPartialUserCollection";
import { createFFZUserSets } from "./createFFZUserSets";
import type { FrankerFaceZSet } from "./FrankerFaceZSet";

export function createFFZUserCollection(
  ffzState: NonNullable<FFZAsyncState["state"]["value"]>,
  ffzRoomState: NonNullable<FFZRoomAsyncState["state"]["value"]>,
): FrankerFaceZUserCollection {
  return new FFZUserCollection(
    new FFZPartialUserCollection(
      new FFZCollectionOwner(
        ffzState.user,
        Object.values(ffzState.badges).map((badge) => new FFZUserBadge(badge)),
      ),
    ),
    createFFZUserSets(ffzRoomState.sets),
  );
}

export function createFFZUserCollection2(
  partialCollection: FrankerFaceZPartialUserCollection,
  sets: FrankerFaceZSet[],
): FrankerFaceZUserCollection {
  return new FFZUserCollection(partialCollection, sets);
}
