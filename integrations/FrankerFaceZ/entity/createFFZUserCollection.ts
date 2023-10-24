import {
  FFZUserCollection,
  type FrankerFaceZUserCollection,
} from "./FrankerFaceZUserCollection";
import { FFZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import { FFZEmote } from "./FrankerFaceZEmote";
import { FFZSet } from "./FrankerFaceZSet";
import { FFZUserBadge } from "./FrankerFaceZUserBadge";

export async function createFFZUserCollection(
  ffzState: NonNullable<FFZAsyncState["state"]["value"]>,
  ffzRoomState: NonNullable<FFZRoomAsyncState["state"]["value"]>,
): Promise<FrankerFaceZUserCollection> {
  const ffzSets = Object.values(ffzRoomState.sets).map(
    (apiSet) =>
      new FFZSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "channel")),
  );
  return new FFZUserCollection(
    ffzSets,
    new FFZCollectionOwner(
      ffzState.user,
      Object.values(ffzState.badges).map((badge) => new FFZUserBadge(badge)),
    ),
  );
}
