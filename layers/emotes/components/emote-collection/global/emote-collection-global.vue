<template>
  <div class="w-96 rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.global.link") }}
      </h2>
      <emote-integration-logos />
    </div>
    <div class="space-y-2" @mouseover="throttledMouseover">
      <button
        class="btn btn-primary btn-lg w-full flex-nowrap text-pretty border-2 border-base-content text-xl"
        @click="globalCollectionStore.integrations.updateAll"
      >
        {{ $t("collections.global.update-all-emotes") }}
        <div
          class="rounded border-[3px] border-base-100 bg-base-content p-1 pr-2"
        >
          <emote-integration-logos />
        </div>
      </button>
      <dev-only><emote-collection-search-emote /></dev-only>
      <template
        v-for="integration of globalCollectionStore.integrations.state"
        :key="integration.source"
      >
        <emote-collection-global-integration
          v-model:checkedSources="globalCollectionStore.checkedSources.state"
          :integration
          @update="globalCollectionStore.integrations.update(integration)"
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
        </emote-collection-global-integration>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalCollectionStore = useGlobalCollectionStore();

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.globalEmotesHandler,
  100,
  true,
);
</script>
