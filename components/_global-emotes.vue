<template>
  <div class="rounded-box border-2 p-2">
    <h2 class="px-2 text-3xl font-bold">Global emotes</h2>
    <template v-if="!globalCollectionsStore.collections.isReady">
      <div>not ready</div>
    </template>
    <template v-if="globalCollectionsStore.collections.isLoading">
      <div>loading</div>
    </template>
    <div
      v-if="globalCollectionsStore.collections.isReady"
      role="tablist"
      class="tabs tabs-lifted w-96 rounded-[10px] border border-base-300"
    >
      <template
        v-for="collection of globalCollectionsStore.collections.state"
        :key="collection.source"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-300"
          :aria-label="collection.source"
        />
        <global-emote-collection
          role="tabpanel"
          class="tab-content"
          :collection="collection"
          @update="globalCollectionsStore.refreshGlobalCollection(collection)"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalCollectionsStore = useGlobalCollectionsStore();
</script>
