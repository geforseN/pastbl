<template>
  <main class="flex flex-col gap-1">
    <emote-collection-collapsed-set
      class="border-2 border-[#63b3ed]"
      v-for="[setName, set] of Object.entries(props.emoteSets)"
      :key="setName"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="BetterTTV emote set name">
            {{ setName }}
          </h3>
          <span class="text-sm">
            {{ set.length }}
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
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-[#63b3ed]/20"
            v-for="emote of set"
            :key="emote.id"
          >
            <img
              class="m-0.5"
              :key="emote.id"
              :src="`https://cdn.betterttv.net/emote/${emote.id}/1x.webp`"
              loading="lazy"
              :title="emote.code"
              :alt="emote.code"
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>

<script lang="ts" setup>
import type { BetterTTVEmoteFromAPI } from "~/integrations/BetterTTV/BetterTTV.api";

const props = defineProps<{
  emoteSets: Record<string, BetterTTVEmoteFromAPI[]>;
}>();
</script>

<style></style>
