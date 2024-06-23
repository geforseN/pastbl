<template>
  <div class="w-96 space-y-2">
    <emote-collection-person
      :login
      @deleted="async () => await navigateTo(useLocalePath()('/collections'))"
    />
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script setup lang="ts">
const login = getRouteStringParam("nickname", toLowerCase);
</script>
