<template>
  <section
    class="flex flex-col divide-y divide-[#63b3ed] border-2 border-[#63b3ed] bg-[#1a202c] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="bttv.isLoading.value"
      :is-ready="bttv.isReady.value"
      :is-error="!!bttv.error.value"
    >
      <h3>BetterTTV</h3>
      <template #collection-logo>
        <icons-bttv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <main
      class="flex flex-col gap-2 pt-2"
      v-if="bttv.isReady.value && bttv.state.value"
    >
      <emote-collection-bttv-set
        v-for="[emoteSetName, emoteSet] of <
          [string, BetterTTVEmoteFromAPI[]][]
        >[
          ['Channel emotes', bttv.state.value.channelEmotes],
          ['Shared emotes', bttv.state.value.sharedEmotes],
        ]"
        :emote-set="emoteSet"
        :emote-set-name="emoteSetName"
      ></emote-collection-bttv-set>
    </main>
    <template v-if="bttv.isLoading.value">
      <div class="relative w-full">
        <div class="absolute inset-0 mt-1 animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
        <span>Loading</span>
      </div>
    </template>
    <template v-if="bttv.error.value">{{ bttv.error.value }}</template>
  </section>
</template>

<script lang="ts" setup>
import type { BetterTTVEmoteFromAPI } from "~/integrations/BetterTTV/BetterTTV.api";

defineProps<{ bttv: BTTV }>();
</script>
