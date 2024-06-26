<template>
  <div class="w-96 space-y-2">
    <emote-collection-global-integration-of-source :source />
    <app-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-link>
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
import { emoteSources } from "~/integrations/emote-source";

const maybeSource = getRouteStringParam("source", toLowerCase);
const source = emoteSources.find(
  (source) => toLowerCase(source) === maybeSource,
);

assert.ok(source);

useHead({
  title: `${source} Global Emotes`,
});
</script>
