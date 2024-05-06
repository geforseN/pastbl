<template>
  <emote-collection-global-integration
    v-if="integration"
    v-model:checkedSources="globalCollectionStore.checkedSources.state"
    :integration
    @mouseover="throttledMouseover"
    @refresh="
      () => {
        assert.ok(integration);
        globalCollectionStore.integrations.refresh(integration);
      }
    "
    @load="
      () => {
        assert.ok(integration);
        globalCollectionStore.integrations.load(integration);
      }
    "
  />
</template>
<script setup lang="ts">
import type { EmoteSource } from "~/integrations";

const globalCollectionStore = useGlobalCollectionStore();

const props = defineProps<{
  source: EmoteSource;
}>();

const integration = ref(globalCollectionStore.integrations.state[props.source]);

// NOTE: integration can be undefined if user deleted data in IndexedDB or it is first time page load and global collections did not load yet
if (!integration.value) {
  const loading = { source: props.source, status: "loading" } as const;
  globalCollectionStore.integrations.set(props.source, loading);
  integration.value = loading;
  globalCollectionStore.integrations.load(props.source).then(() => {
    integration.value = globalCollectionStore.integrations.state[props.source];
  });
}

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.globalEmotesHandler,
  100,
  true,
);
</script>
