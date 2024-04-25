<template>
  <div class="w-96 space-y-2">
    <emote-collection-global
      v-if="collection"
      v-model:checkedSources="globalIntegrationsStore.checkedSources.state"
      status="ready"
      :collection="collection"
      :is-refreshing="globalIntegrationsStore.isCurrentlyLoading(collection)"
      :source="collection.source"
      @mouseover="throttledMouseover"
      @refresh="globalIntegrationsStore.loadIntegration(collection)"
    />
    <app-page-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script setup lang="ts">
import { emoteSources } from "~/integrations";

const globalIntegrationsStore = useGlobalIntegrationsStore();

const maybeSource = getRouteStringParam("source", toLowerCase);
const source =
  [...emoteSources].find((source) => toLowerCase(source) === maybeSource) ||
  raise();
// NOTE: collection can be undefined if deleted data in IndexedDB deleted or (it is first time user and global collections did not load yet)
const collection = computed(
  () => globalIntegrationsStore.integrations.state[source],
);

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.globalEmotesHandler,
  100,
  true,
);
</script>
