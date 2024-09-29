<template>
  <div class="space-y-2">
    <chat-pasta-edit :pasta-id />
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
const pastaId = getRouteStringParam("pastaid", Number);

useHead({
  title: "Edit pasta",
});
</script>
