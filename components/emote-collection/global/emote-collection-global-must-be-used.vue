<template>
  <div class="flex items-center justify-between gap-2">
    <label :for="id">Should be used in pastas</label>
    <input
      :id="id"
      v-model="modelValue"
      :name="id"
      type="checkbox"
      :value="props.source"
      class="checkbox-success checkbox"
    />
  </div>
</template>
<script setup lang="ts">
import type { Colors } from "./emote-collection-global.vue";
import type { EmoteSource } from "~/integrations";

const modelValue = defineModel({ required: true, type: Array<EmoteSource> });

const props = defineProps<{
  source: EmoteSource;
  colors: Colors;
}>();
const id = "global-" + props.source.toLowerCase() + "-emotes-should-be-used";
</script>
