<template>
  <main class="flex flex-col gap-1">
    <emote-collection-collapsed-set
      v-for="set of props.sets"
      :key="set.name"
      class="border-2 border-[#63b3ed]"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="BetterTTV emote set name">
            {{ set.name }}
          </h3>
          <span class="text-sm">
            {{ set.emotes.length }}
            emotes
          </span>
        </div>
      </template>
      <template #emoteList>
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-[#63b3ed] p-2"
          tabindex="0"
        >
          <div
            v-for="emote of set.emotes"
            :key="emote.id"
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-[#63b3ed]/20"
          >
            <img
              :key="emote.id"
              class="m-0.5"
              :src="`https:${emote.url}/1x.webp`"
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
import type { BetterTTVSet } from "~/integrations/BetterTTV/entity/BetterTTVSet";

const props = defineProps<{
  sets: BetterTTVSet[];
}>();
</script>

<style></style>
