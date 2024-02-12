<template>
  <!-- TODO: i18n -->
  <div
    v-if="pastasStore.pastas.isLoading"
    class="skeleton flex h-[60dvh] w-[429px] justify-center rounded-none p-2 go-brr:h-[80dvh]"
  >
    Loading pastas
  </div>
  <template v-if="pastasStore.pastas.isReady">
    <div v-if="pastasStore.selectedShowStrategy === 'selected-user'">
      You need to add tag={{ `@${selectedLogin}` }} to some pasta
    </div>
    <div
      v-if="!pastasStore.pastas.state.length"
      class="mt-4 flex justify-center font-bold"
    >
      No pastas were added yet!
    </div>
  </template>
  <client-only>
    <div
      v-if="!userStore.clipboard.isSupported"
      class="alert alert-warning flex justify-center"
    >
      <span>
        Your browser does not support Clipboard API!. Copy of pasta by clicking
        on the button will fail
      </span>
    </div>
  </client-only>
  <chat-pasta-list-sort-select v-model="pastasStore.selectedSortStrategy" />
  <chat-pasta-list-show-select
    v-model="pastasStore.selectedShowStrategy"
    :selected-login="selectedLogin"
  />
  <dynamic-scroller
    v-if="pastasStore.canShowPastas"
    :items="pastasStore.pastasToShow"
    :min-item-size="100"
    class="pasta-list flex max-h-[60dvh] flex-col gap-y-2 overflow-y-auto xs:w-[426px] go-brr:max-h-[77dvh]"
  >
    <template #default="{ item: pasta, index, active }">
      <dynamic-scroller-item
        :item="pasta"
        :active="active"
        :size-dependencies="[pasta.message]"
        :data-index="index"
      >
        <chat-pasta
          :key="`${pasta.id}:${pasta.text}`"
          :pasta="pasta"
          @populate="
            (pastaTextContainer) => {
              populatePasta(pastaTextContainer, pasta, emotesStore);
            }
          "
        >
          <template #creatorData><slot name="creatorData" /></template>
          <template #sidebar>
            <chat-pasta-sidebar
              dropdown-class="dropdown dropdown-top xs:dropdown-end dropdown-hover"
              :pasta-id="pasta.id"
              :is-clipboard-supported="userStore.clipboard.isSupported"
              @copy="userStore.copyPasta(pasta)"
              @delete="pastasStore.removePasta(pasta)"
            />
          </template>
        </chat-pasta>
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
</template>
<script lang="ts">
export const l = "pasta.list." as const;
</script>
<script setup lang="ts">
defineSlots<{
  creatorData?: () => unknown;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();
const emotesStore = useEmotesStore();

const selectedLogin = computed(
  () => useUserCollectionsStore().selectedCollectionLogin.state,
);
</script>
<style>
.pasta-list .chat-pasta .chat-pasta-sidebar {
  @apply xs:dropdown-left;

  .dropdown .dropdown-content {
    @apply flex w-max flex-row xs:-translate-y-1/2;

    * {
      @apply w-min;
    }
  }
}
</style>
