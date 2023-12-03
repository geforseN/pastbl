<template>
  <div>
    <div
      role="tablist"
      class="tabs tabs-lifted w-96 rounded-b-box rounded-t-[10px] border-2"
    >
      <template
        v-for="source in ['BetterTTV', 'FrankerFaceZ', 'SevenTV']"
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
              collectionsStore.globalCollectionsEntries.find(
                (entry) => entry[1].source === 'BetterTTV',
              )?.[1].sets
            "
          />
          <emote-collection-ffz-sets
            v-else-if="source === 'FrankerFaceZ'"
            class="flex flex-col gap-1 pt-1"
            :sets="
              collectionsStore.globalCollectionsEntries.find(
                (entry) => entry[1].source === 'FrankerFaceZ',
              )?.[1].sets
            "
          />
          <emote-collection-seventv-sets
            v-else-if="source === 'SevenTV'"
            class="pt-1"
            :sets="
              collectionsStore.globalCollectionsEntries.find(
                (entry) => entry[1].source === 'SevenTV',
              )?.[1].sets
            "
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const collectionsStore = useCollectionsStore();
</script>
