<template>
  <div class="w-96 space-y-2">
    <file-pastas-load-input />
    <file-pastas-save-button />
    <pastas-find-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
  title: "Pastas",
});
</script>
