<template>
  <pasta-form
    v-model:tag="pastaStore.tag"
    v-model:text="pastaStore.text"
    :pastaTags="pastaStore.tags"
    :should-tag-model-become-empty-on-add="true"
    @add-tag-to-pasta="() => pastaStore.handleTagAddToPasta()"
    @remove-all-tags="() => pastaStore.removeAllTags()"
    @remove-tag-from-pasta="(tag) => pastaStore.removeTag(tag)"
  >
    <template #header>
      <pasta-form-header
        :jokergeSuggestionMessage="jokergeSuggestionMessage"
        @jokerge-clicked="handleClickOnJokerge"
      />
    </template>
    <template #button="{ dynamicClass }">
      <button
        class="btn btn-md h-max focus:outline-double focus:outline-4 focus:outline-offset-1 xl:w-full xl:text-lg"
        ref="createPastaButton"
        :class="`${dynamicClass}`"
        @click="handlePastaCreation"
      >
        Create pasta
      </button>
    </template>
    <template #textarea>
      <pasta-form-twitch-chat
        class="mx-0.5"
        id="twitch-chat-pasta-form"
        v-model="pastaStore.text"
        ref="twitchChatRef"
        @enter-pressed="handlePastaCreation"
      />
    </template>
  </pasta-form>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const toast = useToast();

const jokergeSuggestionMessage = ref("Click on me");
const createPastaButton = ref();
const twitchChatRef = ref();

defineExpose({
  twitchChatRef,
});

function handlePastaCreation<_E extends KeyboardEvent | MouseEvent>(
  _event: _E,
) {
  pastasStore
    .createPasta({ tags: pastaStore.tags, text: pastaStore.text })
    .then(() => {
      pastaStore.clear();
      toast.add({
        description: "Pasta added successfully",
        title: "Pasta 🤙🤙🤙",
      });
    })
    .catch((error) => {
      if (!(error instanceof ExtendedError)) {
        throw error;
      }
      toast.add({
        description: error.message,
        title: "Pasta creation went wrong",
        color: "red",
        timeout: 10_000,
      });
    });
}

function handleClickOnJokerge() {
  if (!jokergeSuggestionMessage.value) {
    return;
  }
  createPastaButton.value.focus();
  pastaStore.text =
    "⡶⠶⠂⠐⠲⠶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⡶⠶⡶⣶ ⣗⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⠿⣿⠿⣿⣿⣿⣿⠿⠿⠿⠟⠛⠉⠁⠀⠀⠀⢠⣿ ⣿⣷⣀⠀⠈⠛⠢⠥⠴⠟⠂⠀⠀⠀⠉⣛⠉⠁⠀⠐⠲⠤⠖⠛⠁⠀⠀⣐⣿⣿ ⣿⣿⣿⣦⣄⡀⠀⠀⠀⠀⣀⡠⣤⣦⣿⣿⣿⣆⣴⣠⣀⣀⡀⣀⣀⣚⣿⣿⣿⢳ ⣧⠉⠙⢿⣿⣿⣶⣶⣾⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢇⣿ ⣿⣷⡄⠈⣿⣿⣿⣿⣯⣥⣦⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢉⣴⣿⣿ ⣿⣿⣿⣦⣘⠋⢻⠿⢿⣿⣿⣿⣾⣭⣛⣛⣛⣯⣷⣿⣿⠿⠟⠋⠉⣴⣿⣿⣿⣿ ";
  jokergeSuggestionMessage.value = "Well done";
  setTimeout(() => {
    jokergeSuggestionMessage.value = "";
  }, 5_000);
}
</script>
