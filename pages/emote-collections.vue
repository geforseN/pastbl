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
      <div
        class="flex w-full grow bg-slate-600/20 2xl:max-w-sm"
        v-if="collections.ffz.state.value"
      >
        <img
          width="64"
          height="64"
          :src="collections.ffz.state.value.user.avatar"
          :alt="collections.ffz.state.value.user.display_name + ' avatar'"
        />
        <div class="ml-2">
          <template v-if="collections.ffz.state.value.user.badges">
            <img
              class="inline-block h-twitch-badge w-twitch-badge"
              v-for="badge of Object.values(collections.ffz.state.value.badges)"
              :style="{ backgroundColor: badge.color }"
              :src="badge.image"
              :alt="badge.title + ' badge'"
              :title="badge.title"
            />
          </template>
          <span class="ml-1">
            {{ collections.ffz.state.value.user.display_name }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex w-96 flex-col gap-1 2xl:w-auto 2xl:flex-row">
      <emote-collection-ffz
        class="2xl:h-max 2xl:w-80"
        :ffz="collections.ffz"
        :ffz-room="collections.ffzRoom"
      />
      <emote-collection-bttv
        class="2xl:h-max 2xl:w-80"
        :bttv="collections.bttv"
      />
      <emote-collection-seventv
        class="2xl:h-max 2xl:w-80"
        :seventv="collections.seventv"
        :seventv-set="collections.seventvSet"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IDBPDatabase, openDB } from "idb";
import { DBSchema } from "idb";
import FetchEmoteCollectionsInputGroup from "~/components/fetch-emote-collections-input-group.vue";

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

interface EmoteCollection extends DBSchema {
  "current-collection-name": {
    key: string;
    value: string;
  };
  "saved-collections": {
    value: {
      nickname: string;
      isLoadedCorrectly: boolean;
      bttv?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
      "7tv"?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
      ffz?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
    };
    key: string /* key is twitch nickname */;
    indexes: { "by-price": number };
  };
}
</script>

<style></style>
