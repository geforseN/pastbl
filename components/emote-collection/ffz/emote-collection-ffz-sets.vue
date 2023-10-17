<template>
  <main class="flex flex-col gap-1">
    <emote-collection-collapsed-set
      class="border-2 border-ffz"
      v-for="set of props.sets"
      :key="set.id"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="FrankerFaceZ emote set name">
            {{ set.title }}
          </h3>
          <span class="text-sm">
            {{ set.emoticons.length }}
            <span v-if="props.maxEmoticons">
              {{ ` / ${props.maxEmoticons}` }}
            </span>
            emotes
          </span>
        </div>
      </template>
      <template #emoteList>
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-ffz p-2"
          tabindex="0"
        >
          <div
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-ffz/20"
            v-for="emote of set.emoticons"
            :key="emote.id"
          >
            <img
              class="m-0.5"
              :src="emote.urls[1]"
              loading="lazy"
              :title="emote.name"
              :alt="emote.name"
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>

<script lang="ts" setup>
import type { fetchFFZUserRoomByTwitchId } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

type FFZSetRecord = Awaited<
  ReturnType<typeof fetchFFZUserRoomByTwitchId>
>["sets"];
type FFZSet = FFZSetRecord[keyof FFZSetRecord];

const props = defineProps<{
  sets: FFZSet[];
  maxEmoticons?: number;
}>();
</script>
