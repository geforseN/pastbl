<template>
  <div>
    <client-only>
      <div
        v-if="!userStore.clipboard.isSupported"
        class="alert alert-warning flex flex-col justify-center gap-1 p-3"
      >
        <h3 class="font-bold">{{ $t(l + "clipboardFail.heading") }}</h3>
        {{ $t(l + "clipboardFail.explanation") }}
      </div>
    </client-only>
    <div class="rounded-btn rounded-b-none border-2 border-b-0 px-2 py-1.5">
      <chat-pasta-list-sort-select v-model="pastasStore.selectedSortStrategy" />
      <chat-pasta-list-show-select
        v-model="pastasStore.selectedShowStrategy"
        :selected-login="selectedLogin"
      />
    </div>
    <slot name="default">
      <!-- NOTE: chat-pasta-list expected here -->
    </slot>
    <div
      v-if="pastasStore.pastas.isLoading"
      class="skeleton flex h-[50dvh] justify-center rounded-btn rounded-t-none p-2 go-brr:h-[66dvh]"
    >
      {{ $t(l + "loading") }}
    </div>
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
      <div
        v-if="!pastasStore.pastas.state.length"
        class="flex justify-center bg-warning font-bold text-warning-content"
      >
        {{ $t(l + "empty") }}
      </div>
      <template v-if="pastasStore.selectedShowStrategy !== 'none'">
        <app-hint-current-emotes
          v-if="isEmotesLoaded && selectedCollection"
          class="max-w-[400px]"
          :collection="selectedCollection"
        />
        <app-hint-add-emotes v-else />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";

defineSlots<{
  default: () => void;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();
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
