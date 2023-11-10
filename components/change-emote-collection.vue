<template>
  <section class="border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change emote collection</h2>
    1: {{ collectionToSelect }} 2: {{ selectedCollection }}
    <client-only>
      <div v-if="globalCollectionsEntries.length" class="border">
        <emote-collection-global-table :entries="globalCollectionsEntries" />
      </div>
    </client-only>
  </section>
</template>

<script lang="ts" setup>
import type { IGlobalEmoteCollection } from "~/integrations";

const collectionToSelect = ref<string[]>([]);
const selectedCollection = ref<string>();
const globalCollectionsEntries = ref<
  [IGlobalEmoteCollection["source"], IGlobalEmoteCollection][]
>([]);

onMounted(async () => {
  const { openDBs, getKeyValueStore } = await import("~/client-only/IndexedDB");
  const kvStore = await getKeyValueStore();
  const activeCollection = await kvStore.get("activeUserCollection");

  selectedCollection.value = activeCollection?.twitch?.username;

  const { collectionsDB } = await openDBs();
  collectionToSelect.value = await collectionsDB.getAllKeys("users");

  const { emoteCollectionsDB } = await import(
    "~/client-only/IndexedDB/emote-collections"
  );

  const globalCollections = await emoteCollectionsDB.global.getCollections();
  const globalCollectionsRecord = arrayToRecordByValueOfKey(
    globalCollections,
    "source",
  );
  globalCollectionsEntries.value = Object.entries(globalCollectionsRecord);
});
</script>

<style></style>
