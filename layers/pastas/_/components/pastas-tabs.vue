<template>
  <chat-pasta-list-hints>
    <client-only>
      <u-tabs
        :items="tabs"
        class="scrollbar-gutter-stable !space-y-0 border border-base-content"
      >
        <template #default="{ item }">
          <span class="truncate">{{ $t(item.key) }}</span>
        </template>
        <template #item="{ item: selectedTab }">
          <selected-tab-only :selected-tab for="remote">
            <remote-pastas-list
              v-if="userStore.pastasWorkMode.canBeRemote"
              :selected-tab
              :mouseover="throttledMouseover"
            />
            <remote-pastas-unavailable-hint v-else />
          </selected-tab-only>
          <selected-tab-only :selected-tab for="local">
            <local-pastas-list
              v-if="pastasStore.canShowPastas"
              :items="pastasStore.pastasToShow"
              @mouseover="throttledMouseover"
              @remove-pasta="pastasStore.removePasta"
            />
          </selected-tab-only>
        </template>
      </u-tabs>
    </client-only>
  </chat-pasta-list-hints>
</template>
<script setup lang="ts">
const tabs = [{ key: "local" }, { key: "remote" }];

const userStore = useUserStore();
const pastasStore = usePastasStore();

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
