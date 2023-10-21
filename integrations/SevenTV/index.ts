import { __SevenTV__EmoteSetFromApi__, sevenTVApi } from "./SevenTV.api";
import {
  SevenTVSet,
  getSevenTVEmoteCollectionFromStorage,
  setSevenTVEmoteCollectionToStorage,
} from "./SevenTV.client";

export { sevenTV } from "./SevenTV.client";

export async function getSevenTVUserEmoteCollectionByUserId(userId: string) {
  const emoteCollectionFromStorage =
    getSevenTVEmoteCollectionFromStorage(userId);

  //
  type coll = {};
  if (emoteCollectionFromStorage) {
    return emoteCollectionFromStorage;
  }
  const user = await sevenTVApi.fetchUserBySevenTVId(userId);
  const ungroupedEmoteCollections = await Promise.allSettled(
    user.emote_sets.map((set) => sevenTVApi.fetchEmoteSetById(set.id)),
  );
  const emoteCollections = groupEmoteCollections(ungroupedEmoteCollections);

  emoteCollections.fulfilled.forEach((emoteCollection) => {
    setSevenTVEmoteCollectionToStorage(emoteCollection.id, emoteCollection);
  });
  return emoteCollections;
}

function groupEmoteCollections(
  settledCollections: PromiseSettledResult<__SevenTV__EmoteSetFromApi__>[],
) {
  return settledCollections.reduce(
    (collections, settledCollection) => {
      if (settledCollection.status === "fulfilled") {
        collections.fulfilled.push(new SevenTVSet(settledCollection.value));
      } else {
        collections.rejected.push(settledCollection.reason);
      }
      return collections;
    },
    {
      fulfilled: [] as SevenTVSet[],
      rejected: [] as any[],
    },
  );
}
