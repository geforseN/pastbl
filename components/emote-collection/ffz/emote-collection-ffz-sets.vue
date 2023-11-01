<template>
  <main class="relative flex flex-col gap-1">
    <emote-collection-collapsed-set
      v-for="set of props.sets"
      :key="set.id"
      class="border-2 border-ffz"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="FrankerFaceZ emote set name">
            {{ set.name }}
          </h3>
          <span class="text-sm">
            {{ set.emotes.length }}
            <span v-if="props.capacity">
              {{ ` / ${props.capacity}` }}
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
            v-for="emote of set.emotes"
            :key="emote.id"
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-ffz/20"
          >
            <img
              :src="emote.url + '/1'"
              :alt="emote.token"
              :title="emote.token"
              :width="emote.width"
              height="32"
              class="m-0.5"
              loading="lazy"
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>

<script lang="ts" setup>
import type { FrankerFaceZSet } from "~/integrations/FrankerFaceZ/entity/FrankerFaceZSet";

const props = defineProps<{
  sets: FrankerFaceZSet[];
  capacity?: number;
}>();
</script>
