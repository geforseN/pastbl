<template>
  <div>
    <client-only>
      <div
        v-if="!userStore.clipboard.isSupported"
        class="alert alert-warning flex w-[429px] flex-col justify-center gap-1 p-3"
      >
        <h3 class="font-bold">{{ $t(l + "clipboardFail.heading") }}</h3>
        {{ $t(l + "clipboardFail.explanation") }}
      </div>
    </client-only>
    <slot name="default" />
    <div
      v-if="pastasStore.pastas.isLoading"
      class="skeleton flex h-[60dvh] w-[429px] justify-center rounded-none p-2 go-brr:h-[80dvh]"
    >
      {{ $t(l + "loading") }}
    </div>
    <template v-if="pastasStore.pastas.isReady">
      <div
        v-if="
          pastasStore.selectedShowStrategy === 'selected-user' &&
          !pastasStore.pastasToShow.length
        "
        class="flex w-[429px] border-2 border-b-0 px-2 py-1.5"
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
        class="flex justify-center border-2 border-b-0 bg-warning font-bold text-warning-content"
      >
        {{ $t(l + "empty") }}
      </div>
      <app-hint-current-emotes
        v-if="isEmotesLoaded && selectedCollection"
        :collection="selectedCollection"
      />
      <app-hint-add-emotes v-else />
    </template>
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
const selectedLogin = computed(
  () => userCollectionsStore.selectedCollectionLogin.state,
);

const isEmotesLoaded = computedAsync(
  () =>
    until(() => useEmotesStore().isInitialUserEmotesReady).toBeTruthy({
      timeout: 3_000,
    }),
  false,
);
</script>
