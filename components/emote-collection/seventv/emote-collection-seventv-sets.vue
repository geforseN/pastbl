<template>
  <main class="flex flex-col gap-1">
    <emote-collection-collapsed-set
      v-for="set of props.sets"
      :key="set.id"
      class="border-2 border-[#2599cd]"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="SevenTV emote set name">
            {{ set.name }}
          </h3>
          <span class="text-sm">
            {{ set.emotes.length + ` / ${set.capacity}` }}
            emotes
          </span>
        </div>
      </template>
      <template #emoteList>
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-[#2599cd] p-2"
          tabindex="0"
        >
          <div
            v-for="emote of set.emotes"
            :key="emote.id"
            class="grid h-8 place-items-center bg-[#2599cd]/20"
          >
            <img
              class="m-0.5 inline-block hover:scale-110 hover:outline hover:outline-1 hover:outline-[#2599cd]"
              :src="`https:${emote.url}/1x.webp`"
              :width="emote.width"
              loading="lazy"
              :title="emote.token"
              :alt="emote.token"
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>
<script lang="ts" setup>
import type { I7TVSet } from "~/integrations/SevenTV";

const props = defineProps<{
  sets: I7TVSet[];
}>();
</script>
