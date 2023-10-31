<template>
  <div>
    <div v-if="globalFFZ" class="bg-gray-600">
      <div>
        {{ globalFFZ.name }}
      </div>
      <use-time-ago :time="globalFFZ.updatedAt" #="{ timeAgo }">
        Loaded {{ timeAgo }}
      </use-time-ago>
      <div v-for="set of globalFFZ.sets">
        <span v-for="emote of set.emotes" class="ml-1">
          {{ emote.token }}
        </span>
      </div>
    </div>
    <div v-if="globalBTTV" class="bg-red-600">
      <div>
        {{ globalBTTV.name }}
      </div>
      <use-time-ago :time="globalBTTV.updatedAt" #="{ timeAgo }">
        Loaded {{ timeAgo }}
      </use-time-ago>
      <div v-for="set of globalBTTV.sets">
        <span v-for="emote of set.emotes" class="ml-1">
          {{ emote.token }}
        </span>
      </div>
    </div>
    <div v-if="global7TV" class="bg-blue-600">
      <div>
        {{ global7TV.name }}
      </div>
      <use-time-ago :time="global7TV.updatedAt" #="{ timeAgo }">
        Loaded {{ timeAgo }}
      </use-time-ago>
      <div v-for="set of global7TV.sets">
        <span v-for="emote of set.emotes" class="ml-1">
          {{ emote.token }}
        </span>
      </div>
    </div>
    <li
      v-if="global7TV"
      class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
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
  </div>
</template>

<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";

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

onMounted(async () => {});
</script>

<style></style>
