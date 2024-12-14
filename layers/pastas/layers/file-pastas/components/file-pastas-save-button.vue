<template>
  <button
    class="btn btn-primary btn-lg h-max flex-nowrap text-balance px-4 text-3xl"
    @click="savePastasInFile(pastasStore.pastasToShow)"
  >
    <div class="py-1">
      {{ $t("pastas.saveToFile") }}
    </div>
    <div class="flex items-center gap-2">
      <combine-keyboard-keys
        class="text-base-content"
        first="Alt"
        last="S"
      />
      <icon
        name="ic:file-download"
        size="31"
      />
    </div>
  </button>
</template>
<script setup lang="ts">
import { usePastasStore } from "../../../../../app/stores/usePastasStore";

const pastasStore = usePastasStore();
</script>
