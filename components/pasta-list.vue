<template>
  <dialog
    ref="changeCopypastaModalWindow"
    id="changeCopypasta"
    class="modal"
    @close="
      () => {
        selectedCopypastaForChange = null;
        console.log(changeCopypastaModalWindow?.returnValue);
      }
    "
  >
    <div class="modal-box w-max max-w-5xl" v-if="changeCopypastaModalWindow">
      <div class="flex justify-between items-center">
        <h2 class="font-bold text-3xl">Change copypasta</h2>
        <button
          class="btn btn-error"
          @click="changeCopypastaModalWindow.close()"
        >
          <span class="text-lg">EXIT</span>
          <span class="kbd kbd-xs bg-gray-300 text-black">ESC</span>
        </button>
      </div>
      <div class="modal-action">
        <form method="dialog" v-if="selectedCopypastaForChange">
          <pasta-form
            v-model:text="selectedCopypastaForChange.text"
            :pasta-tags="selectedCopypastaForChange.tags"
            :should-tag-model-become-empty="true"
            @create-pasta-enter-pressed="
              () => {
                if (!selectedCopypastaForChange) {
                  throw { message: 'bad' };
                }
                selectedCopypastaForChange.text =
                  selectedCopypastaForChange.text.trimEnd();
                changeCopypastaModalWindow?.close();
              }
            "
            @remove-all-tags="selectedCopypastaForChange.tags = []"
            @remove-tag-from-pasta="
              (tagToRemove) => {
                const index =
                  selectedCopypastaForChange?.tags.indexOf(tagToRemove);
                if (typeof index === 'undefined' || index === -1) {
                  throw { message: 'No tag were found' };
                }
                selectedCopypastaForChange?.tags.splice(index, 1);
              }
            "
            @add-tag-to-pasta="
              (tagToAdd) => {
                if (!selectedCopypastaForChange) {
                  throw { message: 'Internal problem' };
                }
                const tag = tagToAdd.trim();
                if (!tag) {
                  throw new ExtendedError('Can not add empty tag');
                }
                if (selectedCopypastaForChange.tags.includes(tag)) {
                  throw new ExtendedError('Can not add same tag');
                }
                selectedCopypastaForChange.tags.push(tag);
              }
            "
          >
          </pasta-form>
        </form>
        <!-- TODO v-else-if !selectedCopypastaForChange-->
      </div>
    </div>
  </dialog>
  <div v-if="pastasStore.pastas.length === 0" class="justify-self-center mt-4">
    No pastas were added yet!
  </div>
  <div v-else class="">
    <div v-if="!clipboard.isSupported">
      Your browser does not support Clipboard API
    </div>
    <chat-pasta
      v-for="pasta of pastasStore.pastasSortedByNewest"
      :key="pasta.createdAt"
      :pasta="pasta"
      @pasta-remove="pastasStore.removePasta(pasta)"
      @show-change-copypasta-modal-window="
        (pastaPrimaryKey) => {
          if (!changeCopypastaModalWindow) {
            throw { message: 'bad' };
          }
          selectedCopypastaForChange = pasta;
          changeCopypastaModalWindow?.showModal();
        }
      "
    >
      <template #user-nickname>
        <slot />
      </template>
      <template #copypasta-btn>
        <button
          :disabled="!clipboard.isSupported.value"
          class="btn btn-md btn-square rounded-none border-accent border-2 text-xs"
          @click="handleCopypastaCopy(pasta)"
        >
          copy pasta
        </button>
      </template>
    </chat-pasta>
  </div>
</template>

<script setup lang="ts">
const pastasStore = usePastasStore();
const userStore = useUserStore();

const changeCopypastaModalWindow = ref<HTMLDialogElement>();
const selectedCopypastaForChange = ref<MegaPasta | null>(null);

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
    if (userStore.preferences.alerts.copypastaCopy.shouldShowOnSuccess) {
      toast.add({
        description: "Copypasta copied successfully",
        title: "Copypasta 🤙🤙🤙",
        timeout: 1_700,
      });
    }
    if (userStore.preferences.sounds.copypastaCopy.shouldSoundOnSuccess) {
      // TODO add useSound
    }
  } catch (error: Error | unknown) {
    const description =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      error.message;
    toast.add({
      description: description || "Copypasta was not copied",
      title: "Copypasta problem",
      timeout: 7_000,
      color: "red",
    });
  }
}
</script>
