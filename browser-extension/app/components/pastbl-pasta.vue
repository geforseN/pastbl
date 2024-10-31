<template>
  <div class="border-2 border-b-0 px-2 py-1 text-2xl last:border-b-2">
    {{ text }}
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";

defineProps<XPasta>();
</script>
