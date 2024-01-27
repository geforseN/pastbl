<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot name="leftColumn">
      <div class="flex flex-col">
        <chat-pasta-list>
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count.state"
              :nickname="userStore.user.nickname.text.state"
              :nickname-color="userStore.user.debounced.nickname.color"
            />
          </template>
        </chat-pasta-list>
        <app-hint-current-emotes
          v-if="isEmotesLoaded && selectedCollection"
          :collection="selectedCollection"
        />
        <app-hint-add-emotes v-else />
      </div>
    </slot>
    <slot />
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
const userCollectionsStore = useUserCollectionsStore();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);

const isEmotesLoaded = computedAsync(
  () =>
    until(() => useEmotesStore().isInitialUserEmotesReady).toBeTruthy({
      timeout: 3_000,
    }),
  false,
);
</script>
