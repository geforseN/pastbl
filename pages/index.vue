<template>
  <main
    class="mt-2 flex w-full flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <div class="flex flex-col-reverse go-brr:flex-col">
      <client-only>
        <chat-pasta-list>
          <template #userNickname>
            <chat-pasta-nickname :user="userStore.user" />
          </template>
        </chat-pasta-list>
        <button
          class="btn btn-primary sticky top-2 my-2 w-full text-xl go-brr:bottom-2"
          @click="
              () => {
                (pastaFormRef as any).twitchChatRef.textareaRef.focus();
              }
            "
        >
          go create pasta
        </button>
        <template #fallback>
          <div
            class="flex h-[75vh] w-[414px] animate-pulse items-center justify-center bg-base-300"
          >
            <span class="loading" />
          </div>
        </template>
      </client-only>
    </div>
    <div class="flex w-min flex-col gap-y-4">
      <pasta-form-responsive ref="pastaFormRef" />
      <load-emote-collection-form />
      <change-emote-collection />
      <user-settings />
    </div>
  </main>
</template>

<script setup lang="tsx">
import { availableEmoteSources, globalEmotesGetters } from "~/integrations";

useHead({ title: "pastbl", htmlAttrs: { lang: "en" } });

const pastaFormRef = ref();
const userStore = useUserStore();

onMounted(() => {
  addMissingGlobalEmotesCollections();
});

async function addMissingGlobalEmotesCollections() {
  const emoteCollectionsIdb = await import(
    "~/client-only/IndexedDB/index"
  ).then(({ idb }) => idb.emoteCollections);
  const addedGlobalCollectionNames =
    await emoteCollectionsIdb.global.getAllCollectionsKeys();
  const sourcesToLoad = availableEmoteSources.filter(
    (source) => !addedGlobalCollectionNames.includes(source),
  );
  for (const source of sourcesToLoad) {
    const getGlobalCollection = globalEmotesGetters[source];
    const globalCollection = await getGlobalCollection();
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
