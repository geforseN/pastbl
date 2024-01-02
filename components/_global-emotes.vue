<template>
  <div class="w-96 rounded-box border-2 p-2">
    <h2 class="px-2 text-3xl font-bold">Global emotes</h2>
    <ul
      v-if="globalCollectionsStore.collections.isReady"
      class="flex flex-col gap-2"
    >
      <emote-collection-ffz-sync
        v-if="globalCollectionsStore.frankerFaceZCollection"
        class="rounded-btn"
        :sets="globalCollectionsStore.frankerFaceZCollection.sets"
      />
      <emote-collection-bttv-sync
        v-if="globalCollectionsStore.betterTTVCollection"
        class="rounded-btn"
        :sets="globalCollectionsStore.betterTTVCollection.sets"
      />
      <emote-collection-seventv-sync
        v-if="globalCollectionsStore.sevenTvCollection"
        class="rounded-btn"
        :sets="globalCollectionsStore.sevenTvCollection.sets"
      />
      <li
        v-if="globalCollectionsStore.twitchCollection"
        class="flex flex-col divide-y-2 divide-twitch rounded-btn border-2 border-twitch bg-[#0E0E10] p-2 text-white"
      >
        <emote-collection-header
          v-bind="{
            isError: false,
            isLoading: false,
            isReady: true,
          }"
        >
          <h3>Twitch</h3>
          <template #collection-logo>
            <icon-emote-integration-logo
              source="Twitch"
              class="max-h-[32px]"
              height="32"
            />
          </template>
        </emote-collection-header>
        <main class="flex flex-col gap-1 pt-1">
          <emote-collection-collapsed-set
            v-for="set of globalCollectionsStore.twitchCollection.sets"
            :key="set.id"
            class="border-2 border-twitch"
            :set="set"
          >
            <template #title>
              <div class="flex items-baseline justify-between">
                <h3 title="Twitch emote set name">
                  {{ set.name }}
                </h3>
                <span class="text-sm">
                  {{ set.emotes.length }}
                  emotes
                </span>
              </div>
            </template>
            <template #emoteList>
              <div
                class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-twitch p-2"
                tabindex="0"
              >
                <div
                  v-for="emote of set.emotes"
                  :key="emote.id"
                  class="grid h-8 place-items-center bg-[#0E0E10]/20"
                >
                  <img
                    :src="
                      emote.isAnimated
                        ? emote.url.replace('/static/', '/animated/')
                        : emote.url
                    "
                    :alt="emote.token"
                    :title="emote.token"
                    :width="emote.width"
                    :height="emote.height"
                    class="m-0.5 inline-block hover:scale-110 hover:outline hover:outline-1 hover:outline-twitch"
                    loading="lazy"
                  />
                </div>
              </div>
            </template>
          </emote-collection-collapsed-set>
        </main>
      </li>
    </ul>
    <div
      v-else-if="!globalCollectionsStore.collections.isLoading"
      class="flex flex-col items-center p-2"
    >
      <span>Failed to load global emotes</span>
      <span>Please reload the page</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const globalCollectionsStore = useGlobalCollectionsStore();
</script>
