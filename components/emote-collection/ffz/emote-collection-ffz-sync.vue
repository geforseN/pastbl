<template>
  <li
    class="flex flex-col divide-y-2 divide-ffz border-2 border-ffz bg-[#222222] p-2 text-white"
  >
    <emote-collection-header
      :is-error="!!props.error"
      :is-loading="false"
      :is-ready="!props.error"
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
      v-if="props.sets"
      class="flex flex-col gap-1 pt-1"
      :capacity="props.capacity"
      :sets="props.sets"
    />
    <div v-if="props.error">
      {{ props.error.message }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { FrankerFaceZSet } from "~/integrations";

const props = defineProps<{
  sets?: FrankerFaceZSet[];
  capacity?: number;
  error?: Error;
}>();
</script>
