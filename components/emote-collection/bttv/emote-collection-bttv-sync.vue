<template>
  <li
    class="flex flex-col divide-y-2 divide-[#63b3ed] border-2 border-[#63b3ed] bg-[#1a202c] p-2 text-white"
  >
    <emote-collection-header
      v-bind="{ isError: false, isLoading: false, isReady: false }"
    >
      <h3>BetterTTV</h3>
      <template #collection-logo>
        <icons-bttv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-bttv-sets class="pt-1" :sets="props.sets" />
  </li>
</template>
<script lang="ts" setup>
import type { BetterTTVSet } from "~/integrations/BetterTTV";

const props = defineProps<{ sets: BetterTTVSet[] }>();
</script>
