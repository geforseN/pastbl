<template>
  <pasta-form
    v-model:tag="pastaStore.tag"
    v-model:text="pastaStore.text"
    :pasta-tags="pastaStore.tags"
    :should-tag-model-become-empty-on-add="true"
    @add-tag-to-pasta="() => pastaStore.handleTagAddToPasta()"
    @remove-all-tags="() => pastaStore.removeAllTags()"
    @remove-tag-from-pasta="(tag) => pastaStore.removeTag(tag)"
  >
    <template #header>
      <pasta-form-header @require-pasta="pastePastaWithFocus" />
    </template>
    <template #button="{ dynamicClass }">
      <button
        ref="createPastaButton"
        class="btn btn-md h-max focus:outline-double focus:outline-4 focus:outline-offset-1 xl:w-full xl:text-lg"
        :class="`${dynamicClass}`"
        @click="handlePastaCreation"
      >
        Create pasta
      </button>
    </template>
    <template #textarea>
      <pasta-form-twitch-chat
        id="twitch-chat-pasta-form"
        ref="twitchChatRef"
        v-model="pastaStore.text"
        class="mx-0.5"
        @enter-pressed="handlePastaCreation"
      />
    </template>
  </pasta-form>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const toast = useToast();

const createPastaButton = ref();
const twitchChatRef = ref();

defineExpose({
  twitchChatRef,
});

function handlePastaCreation<_E extends KeyboardEvent | MouseEvent>(
  _event: _E,
) {
  try {
    pastasStore.createPasta({ tags: pastaStore.tags, text: pastaStore.text });
    pastaStore.clear();
    toast.add({
      description: "Pasta added successfully",
      title: "Pasta 🤙🤙🤙",
    });
  } catch (error) {
    if (!(error instanceof ExtendedError)) {
      throw error;
    }
    toast.add({
      description: error.message,
      title: "Pasta creation went wrong",
      color: "red",
      timeout: 10_000,
    });
  }
}

function pastePastaWithFocus() {
  createPastaButton.value.focus();
  pastaStore.text =
    "⡶⠶⠂⠐⠲⠶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⡶⠶⡶⣶ ⣗⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⠿⣿⠿⣿⣿⣿⣿⠿⠿⠿⠟⠛⠉⠁⠀⠀⠀⢠⣿ ⣿⣷⣀⠀⠈⠛⠢⠥⠴⠟⠂⠀⠀⠀⠉⣛⠉⠁⠀⠐⠲⠤⠖⠛⠁⠀⠀⣐⣿⣿ ⣿⣿⣿⣦⣄⡀⠀⠀⠀⠀⣀⡠⣤⣦⣿⣿⣿⣆⣴⣠⣀⣀⡀⣀⣀⣚⣿⣿⣿⢳ ⣧⠉⠙⢿⣿⣿⣶⣶⣾⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢇⣿ ⣿⣷⡄⠈⣿⣿⣿⣿⣯⣥⣦⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢉⣴⣿⣿ ⣿⣿⣿⣦⣘⠋⢻⠿⢿⣿⣿⣿⣾⣭⣛⣛⣛⣯⣷⣿⣿⠿⠟⠋⠉⣴⣿⣿⣿⣿ ";
}
</script>
