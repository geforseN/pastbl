<template>
  <div
    v-if="uncheckedSources.length !== allEmoteSources.count"
    class="flex flex-wrap items-center gap-0.5 px-2 py-0.5"
  >
    Showing
    {{ allSourcesChecked && 'all' }}
    <emote-integration-logos
      v-if="!allSourcesChecked"
      :sources="checkedSources"
      flat
      :size="12"
      class="px-0.5"
    />
    <nuxt-link-locale
      class="link inline-flex"
      to="/collections/global"
    >
      global emotes
    </nuxt-link-locale>
    <wrap-with-text
      before="("
      :after="allSourcesChecked ? ')' : 'excluded )'"
    >
      <emote-integration-logos
        :sources="allSourcesChecked ? checkedSources : uncheckedSources"
        flat
        :size="12"
      />
    </wrap-with-text>
  </div>
</template>
<script setup lang="ts">
import { useGlobalEmotesIntegrationsStore } from "~/stores/useGlobalEmotesIntegrationsStore";

const globalEmotesIntegrationsStore = useGlobalEmotesIntegrationsStore();

const allSourcesChecked = computed(
  () => globalEmotesIntegrationsStore.uncheckedSources.length === 0,
);

const checkedSources = computed(
  () => globalEmotesIntegrationsStore.checkedSources.state,
);

const uncheckedSources = computed(
  () => globalEmotesIntegrationsStore.uncheckedSources,
);
</script>
