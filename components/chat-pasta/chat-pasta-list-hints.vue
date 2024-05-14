<template>
  <div class="mx-1">
    <client-only>
      <div
        v-if="false && !$clipboard.isSupported"
        class="alert alert-warning flex w-[420px] flex-col justify-center gap-1 p-3"
      >
        <h3 class="font-bold">{{ $t(l + "clipboardFail.heading") }}</h3>
        <p>{{ $t(l + "clipboardFail.explanation") }}</p>
      </div>
    </client-only>
    <div
      v-if="false"
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
    </div>
    <slot name="default">
      <!-- NOTE: chat-pasta-list expected here -->
    </slot>
    <client-only v-if="false">
      <chat-pasta-list-skeleton v-if="pastasStore.pastas.isLoading" />
      <div
        v-else-if="pastasStore.pastas.isReady"
        class="divide-y-2 rounded-btn rounded-t-none border-2"
      >
        <div
          v-if="
            ['selected-user', 'only-selected-user'].includes(
              pastasStore.selectedShowStrategy,
            ) && !pastasStore.pastasToShow.length
          "
          class="flex px-2 py-1.5"
        >
          <span class="text-nowrap">
            {{ $t(l + "show.selected-user.onEmpty.beforeTag") }}
          </span>
          &nbsp;
          <chat-pasta-tag
            class="line-clamp-1 w-fit break-all"
            :tag="`@${selectedLogin}`"
            :title="selectedLogin"
          />
          &nbsp;
          <span class="text-nowrap">
            {{ $t(l + "show.selected-user.onEmpty.afterTag") }}
          </span>
        </div>
        <chat-pasta-list-hint-on-empty
          v-if="!pastasStore.pastasToShow.length"
        />
        <template v-if="pastasStore.selectedShowStrategy !== 'none'">
          <app-hint-current-emotes
            v-if="isEmotesLoaded && selectedCollection"
            class="w-80 xs:max-w-[400px]"
            :collection="selectedCollection"
          />
          <app-hint-add-emotes v-else />
        </template>
      </div>
      <template #fallback>
        <chat-pasta-list-skeleton />
      </template>
    </client-only>
  </div>
</template>
<script lang="ts" setup>
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";

defineSlots<{
  default: () => void;
}>();

const pastasStore = usePastasStore();
const userCollectionsStore = useUserCollectionsStore();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);
const selectedLogin = computed(() => userCollectionsStore.selectedLogin.state);

const isEmotesLoaded = computedAsync(
  () =>
    until(() => useEmotesStore().isInitialUserEmotesReady).toBeTruthy({
      timeout: 3_000,
    }),
  false,
);
</script>
