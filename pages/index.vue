<template>
  <div class="flex w-96 flex-col gap-2">
    <pasta-form-collapse />
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link
        class="flex items-center justify-between gap-2 text-3xl font-bold"
        to="/pastas/find#pasta-search-parameters-heading"
      >
        <span class="flex items-center gap-2">
          <icon name="carbon:link" />
          Find pasta
        </span>
        🔍
      </nuxt-link>
    </div>
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/user/settings#user-settings-heading">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Change settings
          </span>
          ⚙️
        </span>
      </nuxt-link>
    </div>
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/user/_emotes">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Look for emotes
          </span>
          <div class="flex items-center gap-1">
            <span class="mr-4 flex flex-col gap-1">
              <icon-emote-integration-logo
                v-for="source of [
                'FrankerFaceZ',
                'BetterTTV',
                'SevenTV',
              ] as const"
                v-once
                :key="source"
                :class="
                  source === 'BetterTTV' &&
                  'absolute translate-x-4 translate-y-2'
                "
                :source="source"
                width="16"
                heigth="16"
                class="max-h-[16px] text-xs"
              />
            </span>
          </div>
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { availableEmoteSources, globalEmotesGetters } from "~/integrations";

onBeforeMount(() => {
  addMissingGlobalEmotesCollections();
});

async function addMissingGlobalEmotesCollections() {
  const emoteCollectionsIdb = await import(
    "~/client-only/IndexedDB/index"
  ).then(({ idb }) => idb.emoteCollections);
  const collectionsStore = useCollectionsStore();
  const addedGlobalCollectionNames =
    await emoteCollectionsIdb.global.getAllCollectionsKeys();
  const sourcesToLoad = availableEmoteSources.filter(
    (source) => !addedGlobalCollectionNames.includes(source),
  );
  for (const sourceToLoad of sourcesToLoad) {
    const getGlobalCollection = globalEmotesGetters[sourceToLoad];
    const globalCollection = await getGlobalCollection();
    collectionsStore.global.addCollection(globalCollection);
  }
}
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
