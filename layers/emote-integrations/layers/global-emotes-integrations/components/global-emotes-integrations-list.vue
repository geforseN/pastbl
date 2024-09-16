<template>
  <div class="w-96 rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.global.link") }}
      </h2>
      <emote-integration-logos />
    </div>
    <div
      v-on-mouseover="
        useThrottleFn(emoteOnHover.globalEmotesHandler, 100, true)
      "
      class="space-y-2"
    >
      <update-all-global-emotes-integrations-button
        @click="globalEmotesIntegrationsStore.updateAllIntegrations"
      />
      <dev-only>
        <emote-integrations-emotes-search />
      </dev-only>
      <global-emotes-integration
        v-for="integration of globalEmotesIntegrationsStore.integrationsState"
        :key="integration.source"
        v-model:checked-sources="
          globalEmotesIntegrationsStore.checkedSources.state
        "
        :integration
        @update="globalEmotesIntegrationsStore.updateIntegration(integration)"
      >
        <template #headingMiddle>
          <span class="ml-1 mr-auto">
            <nuxt-link-locale
              :to="`/collections/global/${toLowerCase(integration.source)}`"
            >
              <icon name="carbon:link" />
            </nuxt-link-locale>
          </span>
        </template>
      </global-emotes-integration>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalEmotesIntegrationsStore = useGlobalEmotesIntegrationsStore();

const emoteOnHover = injectEmoteOnHover();
</script>
