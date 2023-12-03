<template>
  <div class="collapse collapse-arrow border-2">
    <input v-model="isCollapseOpen" type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <header class="flex justify-between p-1 text-3xl font-bold">
        <h2 class="">Create pasta</h2>
        <transition name="jokerge">
          <div v-if="!isCollapseOpen" class="flex translate-x-4 gap-1">
            <img
              class="h-8 w-8 translate-y-1"
              src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
              alt="Jokerge emote"
              width="34"
              height="32"
            />
            ☞
          </div>
        </transition>
      </header>
    </div>
    <div class="collapse-content">
      <pasta-form
        v-model:tag="pastaStore.tag"
        v-model:text="pastaStore.text"
        :pasta-tags="pastaStore.tags"
        :must-tag-model-become-empty-on-add="true"
        :hinted-tags-map="pastasStore.mostPopularTagsEntries"
        @add-tag-to-pasta="() => pastaStore.handleTagAddToPasta()"
        @remove-all-tags="() => pastaStore.removeAllTags()"
        @remove-tag-from-pasta="(tag) => pastaStore.removeTag(tag)"
        @create-pasta="() => handlePastaCreation()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const toast = useNuxtToast();

const isCollapseOpen = ref(false);

const twitchChatRef = ref();

defineExpose({
  twitchChatRef,
});

async function handlePastaCreation() {
  try {
    await pastasStore.createPasta({
      tags: pastaStore.tags,
      text: pastaStore.text,
    });
    pastaStore.$reset();
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
</script>
<style scoped>
.jokerge-enter-active,
.jokerge-leave-active {
  transition: opacity 0.5s ease;
}

.jokerge-enter-from,
.jokerge-leave-to {
  opacity: 0;
}
</style>
