<template>
  <global-emotes-integration
    v-if="integration"
    v-model:checkedSources="globalEmotesIntegrationsStore.checkedSources.state"
    :integration
    @mouseover="throttledMouseover"
    @refresh="
      () => {
        assert.ok(integration);
        globalEmotesIntegrationsStore.integrations.refresh(integration);
      }
    "
    @load="
      () => {
        assert.ok(integration);
        globalEmotesIntegrationsStore.integrations.load(integration);
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
  globalEmotesIntegrationsStore.integrations.state[props.source],
);

// NOTE: integration can be undefined if user deleted data in IndexedDB or it is first time page load and global collections did not load yet
// FIXME: rework this code
if (!integration.value) {
  const loading = { source: props.source, status: "loading" } as const;
  globalEmotesIntegrationsStore.integrations.set(props.source, loading);
  integration.value = loading;
  globalEmotesIntegrationsStore.integrations.load(props.source).then(() => {
    integration.value =
      globalEmotesIntegrationsStore.integrations.state[props.source];
  });
}

const throttledMouseover = useThrottleFn(
  emoteOnHover.globalEmotesHandler,
  100,
  true,
);
</script>
