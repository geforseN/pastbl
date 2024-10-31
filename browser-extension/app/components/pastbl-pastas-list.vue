<template>
  <div class="flex flex-col overflow-auto border-b">
    <pastbl-pasta
      v-for="pasta in pastas"
      :key="pasta.id"
      v-bind="pasta"
      @copy="$emit('copy', pasta)"
      @send="$emit('send', pasta)"
    />
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";
import PastblPasta from "~/components/pastbl-pasta.vue";

defineProps<{
  pastas: XPasta[];
}>();

defineEmits<{
  copy: [pasta: XPasta];
  send: [pasta: XPasta];
}>();
</script>
