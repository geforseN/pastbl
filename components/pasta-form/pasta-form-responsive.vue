<template>
  <pasta-form
    v-model:tag="pastaStore.tag"
    v-model:text="pastaStore.text"
    :pastaTags="pastaStore.tags"
    :should-tag-model-become-empty="true"
    @add-tag-to-pasta="() => pastaStore.handleTagAddToPasta()"
    @remove-all-tags="() => pastaStore.removeAllTags()"
    @remove-tag-from-pasta="(tag) => pastaStore.removeTag(tag)"
  >
    <template #header>
      <pasta-form-header />
    </template>
    <template #button="props">
      <button
        class="btn btn-primary btn-md h-max xl:w-full xl:text-lg"
        :class="props.outlineClass[props.pastaStatus]"
        @click="handlePastaCreation"
      >
        Create pasta
      </button>
    </template>
    <template #textarea>
      <twitch-chat
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
</script>
