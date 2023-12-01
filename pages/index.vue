<template>
  <div class="flex flex-col">
    <nuxt-link to="/pastas/find">Find pasta</nuxt-link>
    <pasta-form-collapse />
    <div class="collapse bg-base-300">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">Work with emotes</div>
      <div class="collapse-content">
        <change-emote-collection />
        <load-emote-collection-form />
      </div>
    </div>
    <div class="collapse bg-base-200">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">Change settings</div>
      <div class="collapse-content">
        <user-settings />
      </div>
    </div>
    <div
      role="tablist"
      class="tabs tabs-lifted rounded-box border-2 bg-slate-500"
    >
      <template
        v-for="source in (['BetterTTV', 'FrankerFaceZ', 'SevenTV'] as const)"
        :key="source"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab"
          :aria-label="source"
        />
        <div
          role="tabpanel"
          class="tab-content rounded-box border-base-300 bg-base-100 p-6"
        >
          {{ source }}
        </div>
      </template>
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
