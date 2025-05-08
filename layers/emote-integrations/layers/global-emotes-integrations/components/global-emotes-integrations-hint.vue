<template>
  <div
    v-if="uncheckedSources.length !== allEmoteSources.count"
    class="flex flex-wrap items-center gap-0.5 px-2 py-0.5"
  >
    <template
      v-if="!allSourcesChecked"
    >
      {{ $t('showing') }}
      <emote-integration-logos
        :sources="checkedSources"
        flat
        :size="12"
        class="px-0.5"
      />
    </template>
    <template v-else>
      {{ $t('showing-all') }}
    </template>
    <nuxt-link-locale
      class="link inline-flex"
      to="/collections/global"
    >
      {{ $t('collections.global.link').toLowerCase() }}
    </nuxt-link-locale>
    <wrap-with-text
      before="("
      :after="allSourcesChecked ? ')' : `${$t('excluded').toLowerCase()} )`"
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
import { allEmoteSources } from "../../emote-sources/utils/external";
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
