<template>
  <pasta-tag
    class="line-clamp-2 w-fit break-all"
    data-testid="clamped-pasta-tag"
    v-bind="$props"
  />
</template>
<script setup lang="ts">
import type { PastaTagProps } from "./pasta-tag";
import PastaTag from "./pasta-tag.vue";

defineProps<PastaTagProps>();
</script>
