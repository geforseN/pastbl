<template>
  <div class="w-96 space-y-2">
    <global-emote-integration-of-source :source />
    <app-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-link>
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
const maybeSource = getRouteStringParam("source", toLowerCase);

const source = allEmoteSources.get(
  (source) => toLowerCase(source) === maybeSource,
);

useHead({
  title: `${source} Global Emotes`,
});
</script>
