<template>
  <div
    v-if="pastasStore.pastas.length === 0"
    class="mt-4 flex justify-center font-bold"
  >
    No pastas were added yet!
  </div>
  <div v-else class="flex flex-col gap-y-2">
    <div
      v-if="!clipboard.isSupported"
      class="alert alert-warning flex justify-center"
    >
      <span class="">Your browser does not support Clipboard API!</span>
    </div>
    <chat-pasta
      v-for="pasta of pastasStore.pastasSortedByNewest"
      :key="pasta.createdAt"
      :pasta="pasta"
      @pasta-remove="pastasStore.removePasta(pasta)"
    >
      <template #user-nickname>
        <slot name="user-nickname" />
      </template>
      <template #copypasta-btn>
        <button
          class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
          :disabled="!clipboard.isSupported.value"
          @click="handleCopypastaCopy(pasta)"
        >
          copy pasta
        </button>
      </template>
    </chat-pasta>
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  "user-nickname": () => VNode;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();

const clipboard = useClipboard();
const toast = useToast();

if (!clipboard.isSupported) {
  toast.add({
    description: "Your browser does not support Clipboard API",
    title: "Copypasta problem",
    timeout: 10_000,
    color: "red",
  });
}

async function handleCopypastaCopy(pasta: Pasta) {
  try {
    await clipboard.copy(pasta.text);
    if (!clipboard.copied) {
      throw new Error("Copypasta was not copied");
    }
    if (userStore.preferences.alerts.copypastaCopy.mustShowOnSuccess) {
      toast.add({
        description: "Copypasta copied successfully",
        title: "Copypasta 🤙🤙🤙",
        timeout: 1_700,
      });
    }
    if (userStore.preferences.sounds.copypastaCopy.mustSoundOnSuccess) {
      // TODO add useSound
    }
  } catch (error: Error | unknown) {
    toast.add({
      description:
        error instanceof Error ? error.message : "Something went wrong",
      title: "Copypasta problem",
      timeout: 7_000,
      color: "red",
    });
  }
}
</script>
