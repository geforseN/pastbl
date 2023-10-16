<template>
  <div class="my-2 flex w-full justify-center gap-4">
    <div class="flex w-96 flex-col items-center bg-black/10">
      <emote-collection-fetch-input-group
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
      <div class="flex w-full rounded p-1">
        <div class="h-full grow bg-stone-900">
          <span class="text-5xl">✅ ❌</span>
          <span class="loading loading-dots"></span>
        </div>
        <div class="grow">
          <div class="bg-cyan-800">2</div>
          <div class="bg-gray-700">3</div>
        </div>
      </div>
      <ul class="ml-6 list-disc self-start">
        <li>FrankerFaceZ user information</li>
        <ul class="ml-6 list-disc">
          <li>FrankerFaceZ user emotes</li>
          <li>BetterTTV user collection</li>
          <li>SevenTV user collection</li>
        </ul>
      </ul>
      <div class="flex w-full bg-black/20" v-if="collections.ffz.state.value">
        <img
          width="64"
          height="64"
          :src="collections.ffz.state.value.user.avatar"
          :alt="collections.ffz.state.value.user.display_name + ' avatar'"
        />
        <span class="ml-2">
          {{ collections.ffz.state.value.user.display_name }}
        </span>
        <div class="flex p-1">
          <template v-if="collections.ffz.state.value.user.badges">
            <img
              class=""
              v-for="badge of Object.values(collections.ffz.state.value.badges)"
              :style="{ backgroundColor: badge.color }"
              :src="badge.image"
              :alt="badge.title + 'badge'"
              :title="badge.title"
            />
          </template>
          <span class="ml-1">{{
            collections.ffz.state.value.user.display_name
          }}</span>
        </div>
      </div>
      <div>
        db collections
        <div v-for="collection of dbCollections">
          {{ collection }}
        </div>
      </div>
    </div>
    <div class="flex w-96 flex-col gap-1">
      <emote-collection-ffz
        :ffz="collections.ffz"
        :ffz-room="collections.ffzRoom"
      />
      <emote-collection-bttv :bttv="collections.bttv" />
      <emote-collection-seventv
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
