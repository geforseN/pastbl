<template>
  <div class="mx-1">
    <client-only>
      <div
        v-if="!$clipboard.isSupported"
        class="alert alert-warning flex w-[420px] flex-col justify-center gap-1 p-3"
      >
        <h3 class="font-bold">{{ $t("pasta.list.clipboardFail.heading") }}</h3>
        <p>{{ $t("pasta.list.clipboardFail.explanation") }}</p>
      </div>
    </client-only>
    <div class="rounded-btn rounded-b-none border-2 border-b-0 px-2 py-1.5">
      <client-only>
        <chat-pasta-list-sort-select
          v-model="pastasStore.selectedSortStrategy"
        />
      </client-only>
      <client-only>
        <chat-pasta-list-show-select
          v-model="pastasStore.selectedShowStrategy"
          :selected-login="selectedLogin"
        />
      </client-only>
    </div>
    <slot name="default"><!-- NOTE: chat-pasta-list expected here --></slot>
    <client-only>
      <chat-pasta-list-skeleton v-if="pastasStore.pastas.isLoading" />
      <div
        v-else-if="pastasStore.pastas.isReady"
        class="divide-y-2 rounded-btn rounded-t-none border-2"
      >
        <div
          v-if="
            pastasStore.isPersonTagShowStrategySelected &&
            pastasStore.isNoPastasToShow
          "
          class="flex px-2 py-1.5"
        >
          <i18n-t keypath="pastas.notFoundWithTag">
            <template #tag>
              <chat-pasta-tag
                class="mx-1 line-clamp-1 w-fit break-all"
                :tag="`@${selectedLogin}`"
                :title="selectedLogin"
              />
            </template>
          </i18n-t>
        </div>
        <chat-pasta-list-hint-on-empty
          v-if="pastasStore.pastas.state.length === 0"
        />
        <template v-if="pastasStore.selectedShowStrategy !== 'none'">
          <div
            v-if="isEmotesLoaded && selectedCollection"
            class="my-0.5 flex max-w-[342px] flex-col sm:max-w-[420px]"
          >
            <i18n-t
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
          </div>
          <div v-else>
            <add-emotes-hint />
          </div>
          <div class="flex justify-between p-1">
            <add-emotes-button-link />
            <select-person-collection-dropdown
              :collections="personsEmoteCollections.collectionsToSelect.state"
              @select="personsEmoteCollections.selectCollection"
            />
          </div>
        </template>
      </div>
      <template #fallback>
        <chat-pasta-list-skeleton />
      </template>
    </client-only>
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  default: () => void;
}>();

const pastasStore = usePastasStore();
const personsEmoteCollections = usePersonsEmoteCollectionsStore();

const selectedCollection = computed(
  () => personsEmoteCollections.selectedCollection.state,
);
const selectedLogin = computed(() => personsEmoteCollections.selectedLogin.state);

const isEmotesLoaded = computedAsync(
  () =>
    until(() => useEmotesStore().isInitialUserEmotesReady).toBeTruthy({
      timeout: 3000,
    }),
  false,
);
</script>
