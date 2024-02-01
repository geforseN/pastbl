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
  <div
    class="pasta-list flex max-h-[60dvh] flex-col gap-y-2 overflow-y-auto go-brr:max-h-[77dvh]"
  >
    <chat-pasta
      v-for="pasta of pastasStore.pastasSortedByNewest"
      :key="`${pasta.id}:${pasta.text}`"
      :pasta="pasta"
      @populate="
        async (pastaTextContainer) => {
          // NOTE: two times of nextTick are fix to make emote populate properly after pasta text is changed
          await nextTick().then(() => nextTick());
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
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  creatorData?: () => unknown;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();

const emotesStore = useEmotesStore();
</script>
<style>
.pasta-list .chat-pasta:first-child .chat-pasta-sidebar {
  @apply xs:dropdown-left;

  .dropdown .dropdown-content {
    @apply flex w-max flex-row xs:-translate-y-1/2;

    * {
      @apply w-min;
    }
  }
}
</style>
