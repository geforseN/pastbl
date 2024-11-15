<template>
  <i18n-t
    v-if="isEmotesLoaded && selectedCollection"
    keypath="emotes.showingPastasWithPerson"
    class="flex flex-wrap items-center gap-0.5 px-2 py-0.5"
    tag="div"
  >
    <template #person>
      <selected-person-collection-badge
        :twitch="selectedCollection.person.twitch"
      />
    </template>
  </i18n-t>
  <add-person-emotes-hint v-else />
</template>
<script setup lang="ts">
import { useEmotesStore } from "~/stores/useEmotesStore";
import { usePersonsEmoteCollectionsStore } from "~/stores/usePersonsEmoteCollectionsStore";

const personsEmoteCollections = usePersonsEmoteCollectionsStore();

const selectedCollection = computed(() =>
  withLogSync(
    personsEmoteCollections.selectedCollection.state,
    "selectedCollection",
  ),
);

const isEmotesLoaded = computedAsync(
  () =>
    until(() => useEmotesStore().isInitialUserEmotesReady).toBeTruthy({
      timeout: 3000,
    }),
  false,
);
</script>
