<template>
  <div
    v-if="globalEmotesIntegrationsStore.uncheckedSources.length !== allEmoteSources.count"
    class="flex flex-wrap items-center gap-0.5 px-2 py-0.5"
  >
    Showing
    <span v-if="globalEmotesIntegrationsStore.uncheckedSources.length === 0">
      <nuxt-link-locale
        class="link inline-flex"
        to="/collections/global"
      >
        all global emotes
      </nuxt-link-locale>
      (<emote-integration-logos
        :sources="globalEmotesIntegrationsStore.checkedSources.state"
        flat
        :size="12"
        class="px-0.5"
      />)
    </span>
    <span v-else>
      <emote-integration-logos
        :sources="globalEmotesIntegrationsStore.checkedSources.state"
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
    </span>
    <span
      v-if="globalEmotesIntegrationsStore.uncheckedSources.length > 0"
    >
      (
      <emote-integration-logos
        :sources="globalEmotesIntegrationsStore.uncheckedSources"
        flat
        :size="12"
      />
      excluded)
    </span>
  </div>
</template>
<script setup lang="ts">
import { useGlobalEmotesIntegrationsStore } from "~/stores/useGlobalEmotesIntegrationsStore";

const globalEmotesIntegrationsStore = useGlobalEmotesIntegrationsStore();
</script>
