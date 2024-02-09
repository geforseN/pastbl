<template>
  <div
    v-if="pastasStore.pastas.isLoading"
    class="skeleton flex h-[60dvh] w-[429px] justify-center rounded-none p-2 go-brr:h-[80dvh]"
  >
    Loading pastas
  </div>
  <div
    v-if="pastasStore.pastas.isReady && !pastasStore.pastas.state.length"
    class="mt-4 flex justify-center font-bold"
  >
    No pastas were added yet!
  </div>
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
  <div class="ml-auto flex items-baseline">
    <label for="sort-pastas" class="label font-bold">
      {{ $t(s + "label") }}
    </label>
    <select
      id="sort-pastas"
      v-model="pastasStore.selectedSortStrategy"
      class="select select-secondary select-sm"
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
  <dynamic-scroller
    v-if="canShowPastas"
    :items="pastasStore.sortedPastas"
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

const { t } = useI18n();

const sortOptions = {
  "newest-first": t(so + "newest-first"),
  "oldest-first": t(so + "oldest-first"),
  "last-updated": t(so + "last-updated"),
  "last-copied": t(so + "last-copied"),
};

defineSlots<{
  creatorData?: () => unknown;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();

const emotesStore = useEmotesStore();

const canShowPastas = ref(false);

onMounted(async () => {
  await Promise.all([
    until(() => pastasStore.pastas.isReady).toBeTruthy({ timeout: 5_000 }),
    until(() => emotesStore.isInitialUserEmotesReady).toBeTruthy(),
  ]);
  canShowPastas.value = true;
});
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
