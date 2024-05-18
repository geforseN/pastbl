<template>
  <div class="w-96 space-y-2">
    <emote-collection-global-integration-of-source :source />
    <app-page-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script setup lang="ts">
import { emoteSources } from "~/integrations/emote-source";

const maybeSource = getRouteStringParam("source", toLowerCase);
const source =
  emoteSources.find((source) => toLowerCase(source) === maybeSource) || raise();
</script>
