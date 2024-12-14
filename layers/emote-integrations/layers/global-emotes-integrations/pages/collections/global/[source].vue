<template>
  <div class="w-96 space-y-2">
    <global-emotes-integration-of :source />
    <app-link to="global-emotes">
      <template #right>
        <emote-integration-logos />
      </template>
    </app-link>
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { allEmoteSources } from "$/emote-integrations/layers/emote-sources/utils/external";
import { toLowerCase } from "~/utils/string";
import { getRouteStringParam } from "~/utils/route";

const maybeSource = getRouteStringParam("source", toLowerCase);

const source = allEmoteSources.get(
  (source) => toLowerCase(source) === maybeSource,
);

useHead({
  title: `${source} Global Emotes`,
});
</script>
