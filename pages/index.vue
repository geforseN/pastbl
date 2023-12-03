<template>
  <div class="flex flex-col gap-2">
    <pasta-form-collapse />
    <div class="rounded-2xl border-2 px-4 py-2">
      <nuxt-link
        class="flex items-center justify-between gap-2 text-3xl font-bold"
        to="/pastas/find#pasta-search-parameters-heading"
      >
        🔍 Find pasta
        <icon name="carbon:link" />
      </nuxt-link>
    </div>
    <div class="rounded-2xl border-2 px-4 py-2">
      <nuxt-link to="/user/settings#user-settings-heading">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          ⚙️ Change settings
          <icon name="carbon:link" />
        </span>
      </nuxt-link>
    </div>
    <div class="rounded-2xl border-2 px-4 py-2">
      <nuxt-link to="/user/_emotes">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <div class="flex items-center gap-1">
            <span class="ml-1 mr-5 flex flex-col gap-1">
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
                class="max-h-[24px] text-xs"
              />
            </span>
            Add emotes
          </div>
          <icon name="carbon:link" />
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { availableEmoteSources, globalEmotesGetters } from "~/integrations";

useHead({ title: "pastbl", htmlAttrs: { lang: "en" } });

onMounted(() => {
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
  for (const source of sourcesToLoad) {
    const getGlobalCollection = globalEmotesGetters[source];
    const globalCollection = await getGlobalCollection();
    collectionsStore.globalCollectionsEntries.push([source, globalCollection]);
    emoteCollectionsIdb.global.addCollection(globalCollection);
  }
}
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
