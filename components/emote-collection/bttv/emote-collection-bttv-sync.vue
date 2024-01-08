<template>
  <li
    class="flex flex-col divide-y-2 divide-[#63b3ed] border-2 border-[#63b3ed] bg-[#1a202c] p-2 text-white"
  >
    <emote-collection-header
      v-bind="{
        isError: !!props.error,
        isLoading: false,
        isReady: !props.error,
      }"
    >
      <h3>BetterTTV</h3>
      <template #collection-logo>
        <icon-emote-integration-logo
          source="BetterTTV"
          class="max-h-[32px]"
          height="32"
        />
      </template>
    </emote-collection-header>
    <emote-collection-bttv-sets
      v-if="props.sets"
      class="pt-1"
      :sets="props.sets"
    />
    <div v-if="props.error">
      {{ props.error.message }}
    </div>
  </li>
</template>
<script lang="ts" setup>
import type { BetterTTVSet } from "~/integrations";

const props = defineProps<{ sets?: BetterTTVSet[]; error?: Error }>();
</script>
