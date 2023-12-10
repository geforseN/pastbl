<template>
  <div class="rounded-box border-2 p-2">
    <div>Global emotes</div>
    <div
      role="tablist"
      class="tabs tabs-lifted w-96 rounded-[10px] border border-base-300"
    >
      <template
        v-for="source in ['BetterTTV', 'FrankerFaceZ', 'SevenTV'] as const"
        :key="source"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-300"
          :aria-label="source"
        />
        <div role="tabpanel" class="tab-content rounded-box bg-base-100 p-2">
          <emote-collection-bttv-sets
            v-if="source === 'BetterTTV'"
            class="pt-1"
            :sets="
              collectionsStore.global.getCollectionWithSource('BetterTTV')?.sets
            "
          />
          <emote-collection-ffz-sets
            v-else-if="source === 'FrankerFaceZ'"
            class="flex flex-col gap-1 pt-1"
            :sets="
              collectionsStore.global.getCollectionWithSource('FrankerFaceZ')
                ?.sets
            "
          />
          <emote-collection-seventv-sets
            v-else-if="source === 'SevenTV'"
            class="pt-1"
            :sets="
              collectionsStore.global.getCollectionWithSource('SevenTV')?.sets
            "
          />
          <use-time-ago
            :time="
              collectionsStore.global.getCollectionWithSource('SevenTV')!
                ?.updatedAt
            "
            #="{ timeAgo }"
          >
            <div>Emotes was loaded {{ timeAgo }}</div>
          </use-time-ago>
          <button
            class="btn btn-primary"
            @click="
              collectionsStore.global.refreshCollection(
                collectionsStore.global.getCollectionWithSource(source),
              )
            "
          >
            Update
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const collectionsStore = useCollectionsStore();
</script>
