import { allEmoteSources } from "../emote-sources/utils/emote-sources";

export async function deleteEmoteCollection(login: TwitchUserLogin, database) {
  const transaction = database.transaction(
    ["persons-emotes", "persons-collection"],
    "readwrite",
  );
  const collectionsStore = transaction.objectStore("persons-collection");
  const [collection, allCollections] = await Promise.all([
    collectionsStore.get(login),
    collectionsStore.getAll(),
  ]);
  await Promise.all([
    deleteEmotes(
      collection,
      allCollections,
      transaction.objectStore("persons-emotes"),
    ),
    collectionsStore.delete(login),
  ]);
}

function getEmoteIds(collection) {
  return collection.integration.sets.flatMap((set) => set.emoteIds);
}

function getUniqueEmoteIds(collections) {
  const emotesIds = allEmoteSources.flatGroupBy(
    (source) => source,
    () => new Set<string>(),
  );
  const emotesIdsToIgnore = allEmoteSources.flatGroupBy(
    (source) => source,
    () => new Set<string>(),
  );
  for (const collection of collections) {
    const integrations = Object.values(collection.integrations);
    for (const integration of integrations) {
      const { source } = integration;
      const emoteIds = emotesIds[source];
      const emoteIdsToIgnore = emotesIdsToIgnore[source];
      for (const set of integration.sets) {
        for (const emoteId of set.emoteIds) {
          if (emoteIdsToIgnore.has(emoteId)) {
            continue;
          }
          if (emoteIds.has(emoteId)) {
            emoteIdsToIgnore.add(emoteId);
            emoteIds.delete(emoteId);
          } else {
            emoteIds.add(emoteId);
          }
        }
      }
    }
  }
  return emotesIds;
}

function deleteEmotes(collection, allCollections, emotesStore) {
  const collectionEmoteIdsRecord = getEmoteIds(collection);
  const allEmoteIds = getUniqueEmoteIds(allCollections);
  const deletePromises = objectValues(allEmoteIds).map(
    // NOTE: MUST use async function OR assert will fail other promises
    async ([source, allEmoteIds]) => {
      assert.ok(source && allEmoteSources.has(source));
      const emoteIds = collectionEmoteIdsRecord[source];
      assert.ok(
        emoteIds,
        `User collection does not have ${source} source (not fatal)`,
      );
      const sameEmoteIds = setIntersection(emoteIds, allEmoteIds);
      return await emotesStore.__deleteEmotes(source, [...sameEmoteIds]);
    },
  );
  return deletePromises;
}
