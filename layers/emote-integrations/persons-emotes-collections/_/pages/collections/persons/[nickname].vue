<template>
  <div class="w-96 space-y-2">
    <person-emotes-collection
      :login
      @deleted="async () => await navigateTo(useLocalePath()('/collections'))"
    />
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
const login = getRouteStringParam("nickname", toLowerCase);

useHead({
  title: `${login} Emotes Collection`,
});
</script>
