<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot />
    <slot name="leftColumn">
      <chat-pasta-list-hints>
        <client-only>
          <u-tabs
            :items="tabs"
            class="scrollbar-gutter-stable !space-y-0 border border-base-content"
          >
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
    </slot>
  </div>
</template>
<script setup lang="ts">
import type { LocalPastasList } from "#components";

const tabs = [
  {
    label: "Local",
    key: "local",
  },
  {
    label: "Remote",
    key: "remote",
  },
];

const userStore = useUserStore();
const pastasStore = usePastasStore();

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
<style>
.chat-pasta-list {
  max-height: 50dvh;
}

@media (min-width: 890px) {
  .chat-pasta-list {
    max-height: 60dvh;
  }
}

.scrollbar-gutter-stable {
  scrollbar-gutter: stable;
}
</style>
