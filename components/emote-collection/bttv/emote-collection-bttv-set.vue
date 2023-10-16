<template>
  <div class="collapse collapse-arrow border border-[#63b3ed]">
    <input
      v-model="isOpen"
      type="checkbox"
      @keypress.enter="isOpen = !isOpen"
    />
    <div class="collapse-title flex items-center">
      <div title="BetterTTV emote set name">
        {{ props.emoteSetName }}
      </div>
      <div class="ml-auto text-sm">
        {{ props.emoteSet.length }}
        emotes
      </div>
    </div>
    <div class="collapse-content">
      <div
        class="max-h-60 overflow-y-auto border border-[#63b3ed]"
        tabindex="0"
      >
        <img
          class="mx-1 my-0.5 inline-block"
          v-for="emote of props.emoteSet"
          :key="emote.id"
          :src="`https://cdn.betterttv.net/emote/${emote.id}/1x.webp`"
          loading="lazy"
          :title="emote.code"
          :alt="emote.code + 'emote'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BetterTTVEmoteFromAPI } from "~/integrations/BetterTTV/BetterTTV.api";

const isOpen = defineModel("isOpen", { local: true, type: Boolean });

const props = defineProps<{
  emoteSet: BetterTTVEmoteFromAPI[];
  emoteSetName: string;
}>();
</script>

<style></style>
