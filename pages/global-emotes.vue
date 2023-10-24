<template>
  <div class="bg-gray-600" v-if="globalFFZ">
    <div>
      {{ globalFFZ.name }}
    </div>
    <use-time-ago :time="globalFFZ.updatedAt" #="{ timeAgo }">
      Loaded {{ timeAgo }}
    </use-time-ago>
    <div v-for="set of globalFFZ.sets">
      <span class="ml-1" v-for="emote of set.emotes">
        {{ emote.token }}
      </span>
    </div>
  </div>
  <div class="bg-red-600" v-if="globalBTTV">
    <div>
      {{ globalBTTV.name }}
    </div>
    <use-time-ago :time="globalBTTV.updatedAt" #="{ timeAgo }">
      Loaded {{ timeAgo }}
    </use-time-ago>
    <div v-for="set of globalBTTV.sets">
      <span class="ml-1" v-for="emote of set.emotes">
        {{ emote.token }}
      </span>
    </div>
  </div>
  <div class="bg-blue-600" v-if="global7TV">
    <div>
      {{ global7TV.name }}
    </div>
    <use-time-ago :time="global7TV.updatedAt" #="{ timeAgo }">
      Loaded {{ timeAgo }}
    </use-time-ago>
    <div v-for="set of global7TV.sets">
      <span class="ml-1" v-for="emote of set.emotes">
        {{ emote.token }}
      </span>
    </div>
  </div>
  <li
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
    v-if="global7TV"
  >
    <emote-collection-header
      :is-loading="false"
      :is-ready="false"
      :is-error="false"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icons-seventv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-seventv-sets class="pt-1" :sets="global7TV.sets" />
  </li>
</template>

<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";
import { openDB } from "idb";
import type { EmoteCollection } from "~/integrations";

const dbGlobalEmotesCollections = ref<any[]>([]);

const global7TV = computed(
  () =>
    dbGlobalEmotesCollections.value?.find(
      (collection) => collection.source === "SevenTV",
    ),
);
const globalFFZ = computed(
  () =>
    dbGlobalEmotesCollections.value?.find(
      (collection) => collection.source === "FrankerFaceZ",
    ),
);
const globalBTTV = computed(
  () =>
    dbGlobalEmotesCollections.value?.find(
      (collection) => collection.source === "BetterTTV",
    ),
);

onMounted(async () => {
  const db = await openDB("emote-collections", 1, {
    upgrade(db) {
      db.createObjectStore("@@global", {
        keyPath: "name",
      });
    },
  });

  dbGlobalEmotesCollections.value = await db.getAll("@@global");
});
</script>

<style></style>
