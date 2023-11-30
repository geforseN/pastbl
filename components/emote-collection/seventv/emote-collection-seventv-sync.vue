<template>
  <li
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
  >
    <emote-collection-header
      v-bind="{ isError: false, isLoading: false, isReady: false }"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icon-emote-integration-logo
          source="SevenTV"
          class="max-h-[32px]"
          height="32"
        />
      </template>
    </emote-collection-header>
    <emote-collection-seventv-sets class="pt-1" :sets="props.sets" />
  </li>
</template>
<script lang="ts" setup>
import type { I7TVSet } from "~/integrations";

const props = defineProps<{ sets: I7TVSet[] }>();
</script>
