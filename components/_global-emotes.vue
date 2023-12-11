<template>
  <div class="w-96 rounded-box border-2 p-2">
    <h2 class="px-2 text-3xl font-bold">Global emotes</h2>
    <ul
      v-if="globalCollectionsStore.collections.isReady"
      class="flex flex-col gap-2"
    >
      <emote-collection-ffz-sync
        v-if="frankerFaceZCollection"
        class="rounded-btn"
        :sets="frankerFaceZCollection.sets"
      />
      <emote-collection-bttv-sync
        v-if="betterTTVCollection"
        class="rounded-btn"
        :sets="betterTTVCollection.sets"
      />
      <emote-collection-seventv-sync
        v-if="sevenTvCollection"
        class="rounded-btn"
        :sets="sevenTvCollection.sets"
      />
    </ul>
    <div
      v-else-if="!globalCollectionsStore.collections.isLoading"
      class="flex flex-col items-center p-2"
    >
      <span>Failed to load global emotes</span>
      <span>Please reload the page</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalCollectionsStore = useGlobalCollectionsStore();

const frankerFaceZCollection = computed(() =>
  globalCollectionsStore.collections.state.find(
    (c) => c.source === "FrankerFaceZ",
  ),
);
const betterTTVCollection = computed(() =>
  globalCollectionsStore.collections.state.find(
    (c) => c.source === "BetterTTV",
  ),
);
const sevenTvCollection = computed(() =>
  globalCollectionsStore.collections.state.find((c) => c.source === "SevenTV"),
);
</script>
