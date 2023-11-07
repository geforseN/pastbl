<template>
  <div
    v-if="pastasStore.pastas.length === 0"
    class="mt-4 flex justify-center font-bold"
  >
    No pastas were added yet!
  </div>
  <div
    v-if="!clipboard.isSupported"
    class="alert alert-warning flex justify-center"
  >
    <span>
      Your browser does not support Clipboard API!. Copy of pasta by clicking on
      the button will fail
    </span>
  </div>
  <div class="flex max-h-[80dvh] flex-col gap-y-2 overflow-y-auto">
    <chat-pasta
      v-for="pasta of pastasStore.pastasSortedByNewest"
      :key="pasta.createdAt"
      :pasta="pasta"
    >
      <template #userNickname>
        <slot name="userNickname" />
      </template>
      <template #sidebar>
        <div
          class="flex flex-row-reverse gap-x-2 xs:flex-col xs:justify-between xs:gap-x-0"
        >
          <button
            class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
            :disabled="!clipboard.isSupported.value"
            @click="handlePastaCopy(pasta)"
          >
            Copy pasta
          </button>
          <button
            class="btn btn-square btn-warning btn-md rounded-none border-2 border-neutral-content text-xs text-warning-content"
            @click="pastasStore.removePasta(pasta)"
          >
            Delete pasta
          </button>
        </div>
      </template>
    </chat-pasta>
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  userNickname: () => VNode;
}>();

const clipboard = useClipboard();
const pastasStore = usePastasStore();

const { handlePastaCopy } = usePastaCopy({ clipboard, pastasStore });
</script>
