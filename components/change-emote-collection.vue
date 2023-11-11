<template>
  <section class="border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change emote collection</h2>
    <client-only>
      <div class="flex flex-col gap-2">
        <div
          v-if="collectionsStore.usersCollectionsEntries.length"
          class="border"
        >
          <emote-collection-user-table
            :entries="collectionsStore.usersCollectionsEntries"
          />
        </div>
        <div
          v-if="collectionsStore.globalCollectionsEntries.length"
          class="border"
        >
          <emote-collection-global-table
            :entries="collectionsStore.globalCollectionsEntries"
          />
        </div>
      </div>
    </client-only>
  </section>
</template>

<script lang="ts" setup>
const collectionsStore = useCollectionsStore();
</script>
