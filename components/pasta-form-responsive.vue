<template>
  <pasta-form
    :pastaTags="pastaStore.tags"
    v-model:tag="pastaStore.tag"
    v-model:text="pastaStore.text"
    :should-tag-model-become-empty="true"
    @addTagToPasta="() => pastaStore.handleTagAddToPasta()"
    @removeAllTags="() => pastaStore.removeAllTags()"
    @removeTagFromPasta="(tag) => pastaStore.removeTag(tag)"
  >
    <template #header>
      <pasta-form-header />
    </template>
    <template #button="props">
      <button
        :class="`focus-within:outline-${props.pastaLengthColor}`"
        class="btn btn-primary btn-md xl:w-full xl:text-lg h-max"
        @click="handlePastaCreation"
      >
        Create pasta
      </button>
    </template>
    <template #textarea>
      <twitch-chat
        ref="twitchChatRef"
        v-model="pastaStore.text"
        @enter-pressed="handlePastaCreation"
      />
    </template>
  </pasta-form>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();

const toast = useToast();

const twitchChatRef = ref();

defineExpose({
  twitchChatRef,
});

function handlePastaCreation<_E extends KeyboardEvent | MouseEvent>(
  _event: _E
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
</script>
