<template>
  <div class="w-96 space-y-2">
    <client-only>
      <emote-collection-user
        :login
        @deleted="async () => await navigateTo(useLocalePath()('/collections'))"
      />
    </client-only>
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script setup lang="ts">
const login = getRouteStringParam("nickname", toLowerCase);
</script>
