<template>
  <div
    class="my-2 flex w-full items-start justify-center gap-4 2xl:flex-col 2xl:items-center"
  >
    <div
      class="flex flex-col items-center rounded border border-base-content bg-black/10 p-2 2xl:w-[60rem] 2xl:flex-row 2xl:items-start 2xl:justify-between"
    >
      <emote-collection-fetch-input-group
        class="-mt-2 max-w-md"
        v-model:nickname="userNickname"
        @load-collections="
          () => {
            if (doMoreMagic.isLoading.value) {
              return;
            }
            doMoreMagic.execute();
          }
        "
        :is-collections-loading="collections.isLoading.value"
      />
      <emote-collection-user-loaded-data :collections="collections" />
    </div>
    <div class="flex w-96 flex-col gap-1 2xl:w-auto 2xl:flex-row">
      <emote-collection-ffz
        class="min-h-16 2xl:h-max 2xl:w-80"
        :ffz="collections.ffz"
        :ffz-room="collections.ffzRoom"
      />
      <emote-collection-bttv
        class="min-h-16 2xl:h-max 2xl:w-80"
        :bttv="collections.bttv"
      />
      <emote-collection-seventv
        class="min-h-16 2xl:h-max 2xl:w-80"
        :seventv="collections.seventv"
        :seventv-set="collections.seventvSet"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openDB } from "idb";

const userNickname = ref("");
const dbCollections = ref();

const collections = useAsyncEmoteSets(userNickname);

const doMoreMagic = useAsyncState(
  async () => {
    await collections.doMagic();
  },
  null,
  { immediate: false },
);

onMounted(async () => {
  const db = await openDB<EmoteCollection>("emote-collections", 1, {
    upgrade(db) {
      db.createObjectStore("saved-collections", {
        keyPath: "nickname",
      });
    },
  });
  dbCollections.value = await db.getAll("saved-collections");
});
</script>
