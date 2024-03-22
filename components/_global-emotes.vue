<template>
  <div class="w-96 rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.global.link") }}
      </h2>
      <emote-integration-logos />
    </div>
    <div class="flex flex-col gap-2" @mouseover="throttledMouseover">
      <button
        class="btn btn-primary btn-lg w-full flex-nowrap text-pretty border-2 border-base-content text-xl"
        @click="globalCollectionsStore.refreshAllCollections"
      >
        {{ $t("collections.global.refresh-all-button") }}
        <div
          class="rounded border-[3px] border-base-100 bg-base-content p-1 pr-2"
        >
          <emote-integration-logos class="min-w-8" />
        </div>
      </button>
      <dev-only>
        <div class="form-control rounded-btn border border-accent p-2">
          <label for="find-global-emote" class="ml-1 cursor-pointer text-xl">
            {{ $t("emote.find") }}
          </label>
          <input
            id="find-global-emote"
            type="search"
            name="find-global-emote"
            class="input input-sm input-accent"
          />
        </div>
      </dev-only>
      <template
        v-for="collection of globalCollectionsStore.collections.state"
        :key="collection.source"
      >
        <emote-collection-global
          v-if="collection"
          v-model:checkedSources="globalCollectionsStore.checkedSources.state"
          status="ready"
          :collection="collection"
          :is-refreshing="
            globalCollectionsStore.isCurrentlyRefreshing(collection)
          "
          :source="collection.source"
          @refresh="globalCollectionsStore.refreshCollection(collection)"
        >
          <template #headingMiddle>
            <span class="ml-1 mr-auto">
              <nuxt-link-locale
                :to="`/collections/global/${toLowerCase(collection.source)}`"
              >
                <icon name="carbon:link" />
              </nuxt-link-locale>
            </span>
          </template>
        </emote-collection-global>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { OnHoverHint } from "~/app.vue";
import { getEmoteToken } from "~/integrations";

const globalCollectionsStore = useGlobalCollectionsStore();
const emotesStore = useEmotesStore();

const onHoverHint = inject<OnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    findEmote(target) {
      const token = getEmoteToken(target);
      return emotesStore.findGlobalEmote(token);
    },
  }),
  100,
  true,
);
</script>
