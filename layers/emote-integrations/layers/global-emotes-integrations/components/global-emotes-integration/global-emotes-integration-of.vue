<template>
  <global-emotes-integration
    v-if="integration"
    v-model:checkedSources="globalEmotesIntegrationsStore.checkedSources.state"
    :integration
    @mouseover="throttledMouseover"
    @refresh="
      () => {
        assert.ok(integration);
        globalEmotesIntegrationsStore.refreshIntegration(integration);
      }
    "
    @load="
      () => {
        assert.ok(integration);
        globalEmotesIntegrationsStore.loadIntegration(integration);
      }
    "
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  source: EmoteSource;
}>();

const emoteOnHover = injectEmoteOnHover();

const globalEmotesIntegrationsStore = useGlobalEmotesIntegrationsStore();

const integration = ref(
  globalEmotesIntegrationsStore.integrationsState.state[props.source],
);

// NOTE: integration can be undefined if user deleted data in IndexedDB or it is first time page load and global collections did not load yet
// FIXME: rework this code
if (!integration.value) {
  const loading = { source: props.source, status: "loading" } as const;
  globalEmotesIntegrationsStore.integrationsState.set(props.source, loading);
  integration.value = loading;
  globalEmotesIntegrationsStore.loadIntegration(props.source).then(() => {
    integration.value =
      globalEmotesIntegrationsStore.integrationsState.state[props.source];
  });
}

const throttledMouseover = useThrottleFn(
  emoteOnHover.globalEmotesHandler,
  100,
  true,
);
</script>
