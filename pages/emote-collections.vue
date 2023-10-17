<template>
  <div class="my-2 flex w-full items-start justify-center gap-4">
    <div
      class="flex w-96 flex-col items-center gap-2 rounded border border-base-content bg-black/10 p-2"
    >
      <emote-collection-fetch-input-group
        class="-mt-2"
        v-if="shouldShowInput"
        v-model:nickname="nickname"
        @load-collections="
          () => {
            if (fetchCollections.isLoading.value) {
              return;
            }
            fetchCollections.execute();
          }
        "
        :is-collections-loading="collections.isLoading.value"
      />
      <emote-collection-user-loaded-data
        class="w-full"
        :collections="collections"
      />
    </div>
    <!-- NOTE: 
      when user goes to another site page,
      images from emote collections still can be in loading state
      to cancel image loading src attribute of img should be set to empty string => <img src="" alt="any " />
     -->
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

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = !nickname.value;
const collections = useAsyncEmoteSets(nickname);

const fetchCollections = useAsyncState(
  async () => {
    await collections.doMagic();
  },
  null,
  { immediate: false },
);

if (nickname.value) {
  fetchCollections.execute();
}

const dbCollections = ref();

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
