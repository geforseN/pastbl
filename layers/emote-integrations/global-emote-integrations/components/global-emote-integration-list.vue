<template>
  <div class="w-96 rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.global.link") }}
      </h2>
      <emote-integration-logos />
    </div>
    <div class="space-y-2" @mouseover="throttledMouseover">
      <update-all-global-emote-integrations-button
        @click="globalEmoteIntegrationsStore.integrations.updateAll"
      />
      <dev-only>
        <emote-integrations-emotes-search />
      </dev-only>
      <global-emote-integration
        v-for="integration of globalEmoteIntegrationsStore.integrations"
        :key="integration.source"
        v-model:checkedSources="
          globalEmoteIntegrationsStore.checkedSources.state
        "
        :v-bind="integration"
        @update="globalEmoteIntegrationsStore.integrations.update(integration)"
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
      </global-emote-integration>
    </div>
  </div>
</template>
<script setup lang="ts">
const emoteOnHover = injectEmoteOnHover();

const globalEmoteIntegrationsStore = useGlobalEmoteIntegrationsStore();

const throttledMouseover = useThrottleFn(
  emoteOnHover.globalEmotesHandler,
  100,
  true,
);
</script>
