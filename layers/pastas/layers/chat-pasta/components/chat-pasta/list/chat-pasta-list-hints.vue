<template>
  <div class="mx-1">
    <client-only>
      <div
        v-if="!$clipboard.isSupported"
        class="alert alert-warning flex w-[420px] flex-col justify-center gap-1 p-3"
      >
        <h3 class="font-bold">
          {{ $t("pasta.list.clipboardFail.heading") }}
        </h3>
        <p>{{ $t("pasta.list.clipboardFail.explanation") }}</p>
      </div>
    </client-only>
    <fieldset
      :disabled="userStore.selectedTabName === 'remote'"
      class="rounded-btn rounded-b-none border-2 border-b-0 px-2 py-1.5"
    >
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
    </fieldset>
    <slot name="default">
      <!-- NOTE: chat-pasta-list expected here -->
    </slot>
    <client-only>
      <chat-pasta-list-skeleton v-if="pastasStore.pastas.isLoading" />
      <div
        v-else-if="pastasStore.pastas.isReady"
        class="rounded-btn divide-y-2 rounded-t-none border-2"
      >
        <div
          v-if="
            pastasStore.isPersonTagShowStrategySelected
              && pastasStore.isNoPastasToShow
          "
          class="flex px-2 py-1.5"
        >
          <i18n-t keypath="pastas.notFoundWithTag">
            <template #tag>
              <pasta-tag
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
            class="sm:max-w-screen-xs my-0.5 flex max-w-[342px] flex-col empty:m-0 empty:border-0"
          >
            <persons-emotes-collections-hint />
            <global-emotes-integrations-hint />
          </div>
          <div class="flex justify-between p-1">
            <add-person-emotes-button-link />
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
import { PastaTag } from "$ui";

defineSlots<{
  default: VueSlot;
}>();

const userStore = useUserStore();
const pastasStore = usePastasStore();
const personsEmoteCollections = usePersonsEmoteCollectionsStore();

const selectedLogin = computed(
  () => personsEmoteCollections.selectedLogin.state,
);
</script>
