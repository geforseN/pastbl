<template>
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
  <div class="flex items-baseline justify-between">
    <label for="sort-pastas" class="label font-bold">
      {{ $t(s + "label") }}
    </label>
    <select
      id="sort-pastas"
      v-model="pastasStore.selectedSortStrategy"
      class="select select-secondary select-sm w-1/2"
      name="sort-pastas"
    >
      <option
        v-for="[sortName, translatedText] of Object.entries(sortOptions)"
        :key="sortName"
        :value="sortName"
      >
        {{ translatedText }}
      </option>
    </select>
  </div>
  <div class="flex items-baseline justify-between">
    <label for="show-pastas" class="label font-bold">Показывать пасты</label>
    <select
      id="show-pastas"
      v-model="pastasStore.selectedShowStrategy"
      name="show-pastas"
      class="select select-secondary select-sm w-1/2"
    >
      <option value="all">Все</option>
      <option value="selected-user">Все {{ selectedLogin }}</option>
      <option value="except-selected-user">
        Все, кроме {{ selectedLogin }}
      </option>
    </select>
  </div>
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
<script setup lang="ts">
const s = "pasta.list.sort." as const;
const so = "pasta.list.sort.options." as const;

const { t, locale } = useI18n();

const sortOptions = computedWithControl(locale, () => ({
  "newest-first": t(so + "newest-first"),
  "oldest-first": t(so + "oldest-first"),
  "last-updated": t(so + "last-updated"),
  "last-copied": t(so + "last-copied"),
}));

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
