<template>
  <div class="space-y-2">
    <chat-pasta-edit :pastaId />
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script setup lang="ts">
const pastaId = getRouteStringParam("pastaId", Number);
</script>
