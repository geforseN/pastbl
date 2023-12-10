<template>
  <div class="rounded-box border-2 p-2">
    <div>Global emotes</div>
    <template v-if="!globalCollectionsStore.asyncState.isReady">
      <div>not ready</div>
    </template>
    <template v-if="globalCollectionsStore.asyncState.isLoading">
      <div>loading</div>
    </template>
    <div
      v-if="globalCollectionsStore.asyncState.isReady"
      role="tablist"
      class="tabs tabs-lifted w-96 rounded-[10px] border border-base-300"
    >
      <template
        v-for="collection of globalCollectionsStore.asyncState.state"
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
