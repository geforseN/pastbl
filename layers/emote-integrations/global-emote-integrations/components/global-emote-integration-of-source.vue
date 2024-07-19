<template>
  <global-emote-integration
    v-if="integration"
    v-model:checkedSources="globalEmoteIntegrationsStore.checkedSources.state"
    :integration
    @mouseover="throttledMouseover"
    @refresh="
      () => {
        assert.ok(integration);
        globalEmoteIntegrationsStore.integrations.refresh(integration);
      }
    "
    @load="
      () => {
        assert.ok(integration);
        globalEmoteIntegrationsStore.integrations.load(integration);
      }
    "
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  source: EmoteSource;
}>();

const emoteOnHover = injectEmoteOnHover();

const globalEmoteIntegrationsStore = useGlobalEmoteIntegrationsStore();

const integration = ref(
  globalEmoteIntegrationsStore.integrations.state[props.source],
);

// NOTE: integration can be undefined if user deleted data in IndexedDB or it is first time page load and global collections did not load yet
// FIXME: rework this code
if (!integration.value) {
  const loading = { source: props.source, status: "loading" } as const;
  globalEmoteIntegrationsStore.integrations.set(props.source, loading);
  integration.value = loading;
  globalEmoteIntegrationsStore.integrations.load(props.source).then(() => {
    integration.value =
      globalEmoteIntegrationsStore.integrations.state[props.source];
  });
}

const throttledMouseover = useThrottleFn(
  emoteOnHover.globalEmotesHandler,
  100,
  true,
);
</script>
