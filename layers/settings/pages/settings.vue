<template>
  <div class="w-96 space-y-2">
    <settings-form />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
  title: "Settings",
});
</script>
