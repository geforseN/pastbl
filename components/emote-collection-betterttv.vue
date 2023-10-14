<template>
  <section
    class="divide-y-2 border-2 bg-[#1a202c] p-2 text-white"
    v-if="bttv.isReady.value || bttv.isLoading.value"
  >
    <div class="flex items-center justify-between py-1 pl-1">
      <h3 class="text-xl font-medium">BetterTV</h3>
      <icons-bttv-logo width="32" height="32" />
    </div>
    <template v-if="bttv.isReady.value && bttv.state.value">
      <div
        class="py-1"
        v-for="[setName, set] of <[string, BetterTTVEmoteFromAPI[]][]>[
          ['Channel emotes', bttv.state.value.channelEmotes],
          ['Shared emotes', bttv.state.value.sharedEmotes],
        ]"
      >
        <div class="p-1" :title="`BetterTTV ${setName.toLowerCase()} set`">
          {{ setName }}
        </div>
        <div class="h-32 overflow-x-auto">
          <img
            class="mx-1 my-0.5 inline-block"
            v-for="emote of set"
            :key="emote.id"
            :src="`https://cdn.betterttv.net/emote/${emote.id}/1x.webp`"
            loading="lazy"
            :title="emote.code"
            :alt="emote.code + 'emote'"
          />
        </div>
      </div>
    </template>
    <template v-if="bttv.isLoading.value">
      <div class="relative w-full">
        <div class="absolute inset-0 mt-1 animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
        <span>Loading</span>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import type { BetterTTVEmoteFromAPI } from "~/integrations/BetterTTV/BetterTTV.api";
import type { BTTVReturn } from "./emote-collections.vue";

defineProps<{ bttv: BTTVReturn }>();
</script>
