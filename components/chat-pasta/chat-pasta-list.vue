<template>
  <chat-pasta-list-hints>
    <div
      class="rounded-btn rounded-b-none border-2 border-b-0 px-2 py-1.5 xs:w-[420px]"
    >
      <chat-pasta-list-sort-select v-model="pastasStore.selectedSortStrategy" />
      <chat-pasta-list-show-select
        v-model="pastasStore.selectedShowStrategy"
        :selected-login="selectedLogin"
      />
    </div>
    <dynamic-scroller
      v-if="pastasStore.canShowPastas"
      :items="pastasStore.pastasToShow"
      :min-item-size="100"
      class="pasta-list flex max-h-[50dvh] flex-col overflow-y-auto xs:w-[420px] go-brr:max-h-[66dvh]"
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
            <template #creatorData>
              <chat-pasta-creator-data
                :badges-count="userStore.user.badges.count.state"
                :nickname="userStore.user.nickname.text.state"
                :nickname-color="userStore.user.nickname.color.state"
              />
            </template>
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
  </chat-pasta-list-hints>
</template>
<script lang="ts">
export const l = "pasta.list." as const;
</script>
<script setup lang="ts">
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
