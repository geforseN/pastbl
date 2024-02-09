<template>
  <div class="w-96 rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.global.link") }}
      </h2>
      <emote-integration-logos />
    </div>
    <div class="flex flex-col gap-2">
      <button
        class="btn btn-primary btn-lg w-full flex-nowrap text-pretty border-2 border-base-content text-xl"
        @click="globalCollectionsStore.refreshAllCollections"
      >
        {{ $t("collections.global.refresh-all-button") }}
        <div
          class="rounded border-[3px] border-base-100 bg-base-content p-1 pr-2"
        >
          <emote-integration-logos class="min-w-8" />
        </div>
      </button>
      <dev-only>
        <div class="form-control rounded-btn border border-accent p-2">
          <label for="find-global-emote" class="ml-1 cursor-pointer text-xl">
            Find emote
          </label>
          <input
            id="find-global-emote"
            type="search"
            name="find-global-emote"
            class="input input-accent input-sm"
          />
        </div>
      </dev-only>
      <template
        v-for="collection of globalCollectionsStore.collections.state"
        :key="collection.source"
      >
        <emote-collection-global
          v-if="collection"
          v-model:checkedSources="globalCollectionsStore.checkedSources.state"
          status="ready"
          :collection="collection"
          :source="collection.source"
          @refresh="globalCollectionsStore.refreshCollection(collection.source)"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalCollectionsStore = useGlobalCollectionsStore();
</script>
