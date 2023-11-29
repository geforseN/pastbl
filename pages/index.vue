<template>
  <main>
    <div>I'm from index.vue</div>
    <div class="flex w-min flex-col gap-y-4">
      <nuxt-link to="/pastas/create">Create pasta</nuxt-link>
      <nuxt-link to="/pastas/find">Find pasta</nuxt-link>
      <nuxt-link to="/emotes">Emotes emotes</nuxt-link>
      <nuxt-link to="/settings">Change settings</nuxt-link>
    </div>
  </main>
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
