<template>
  <div class="flex items-center justify-between gap-2">
    <label :for="id">{{ $t("mustBeInPastas") }}</label>
    <input
      :id="id"
      v-model="checkedSources"
      :name="id"
      type="checkbox"
      :value="props.source"
      class="checkbox-accent checkbox"
    />
  </div>
</template>
<script setup lang="ts">
import type { EmoteSource } from "~/integrations";

const checkedSources = defineModel<EmoteSource[]>();

const props = defineProps<{
  source: EmoteSource;
}>();

// NOTE: id is reactive, however props.source should not be changed
const id = computed(
  () => `global-${props.source.toLowerCase()}-emotes-must-be-used`,
);
</script>
