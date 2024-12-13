<template>
  <div class="w-96 space-y-2">
    <emojis-groups-list />
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
  title: "Emojis",
});
</script>
