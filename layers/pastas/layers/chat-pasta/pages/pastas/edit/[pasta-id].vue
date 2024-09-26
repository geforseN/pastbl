<template>
  <div class="space-y-2">
    <chat-pasta-edit :pasta-id />
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup>
const pastaId = getRouteStringParam("pasta-id", Number);

useHead({
  title: "Edit pasta",
});
</script>
