<template>
  <li
    class="flex flex-col divide-y-2 divide-ffz border-2 border-ffz bg-[#222222] p-2 text-white"
  >
    <emote-collection-header
      v-bind="{ isError: false, isLoading: false, isReady: false }"
    >
      <h3>FrankerFaceZ</h3>
      <template #collection-logo>
        <icon-emote-integration-logo
          source="FrankerFaceZ"
          class="max-h-[32px]"
          height="32"
        />
      </template>
    </emote-collection-header>
    <emote-collection-ffz-sets
      class="flex flex-col gap-1 pt-1"
      :capacity="props.capacity"
      :sets="props.sets"
    />
  </li>
</template>

<script lang="ts" setup>
import type { FrankerFaceZSet } from "~/integrations";

const props = defineProps<{
  sets: FrankerFaceZSet[];
  capacity?: number;
}>();
</script>
