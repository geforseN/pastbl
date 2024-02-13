<template>
  <div
    class="collapse collapse-arrow border-2"
    @keyup.enter.exact="() => toggleFormCollapse()"
  >
    <input v-model="isFormCollapseOpen.state.value" type="checkbox" />
    <div class="collapse-title text-xl font-medium after:mt-1">
      <header class="flex justify-between text-3xl font-bold">
        <span class="flex items-center gap-2">
          <kbd class="kbd kbd-sm -ml-0.5 px-2 pb-[1px] pt-0.5">i</kbd>
          <h2>{{ $t("pasta.create.heading") }}</h2>
        </span>
        <transition name="jokerge">
          <div
            v-if="!isFormCollapseOpen.state.value"
            class="flex translate-x-3.5 items-center gap-1"
          >
            <img
              class="h-8 w-8 translate-y-1"
              src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
              alt="Jokerge emote"
              width="34"
              height="32"
            />
            <span class="translate-y-0.5">☞</span>
          </div>
        </transition>
      </header>
    </div>
    <div
      class="collapse-content"
      @keyup.escape="() => closeFormCollapse()"
      @keyup.stop="
        () => {}
        /* NOTE: 
          stop propagation is important to prevent collapse from closing
          (when user press 'i' in pasta textarea or in tag input)
        */
      "
    >
      <pasta-form
        ref="pastaFormRef"
        v-model:tag="pastaStore.pasta.tag"
        v-model:text="pastaStore.pasta.text"
        :pasta-tags="pastaStore.pasta.tags"
        :hinted-tags-map="pastasStore.mostPopularTagsEntries"
        @add-tag="() => pastaStore.handleTagAddToPasta()"
        @remove-tag="(tag) => pastaStore.pasta.removeTag(tag)"
        @remove-all-tags="() => pastaStore.pasta.removeAllTags()"
        @create-pasta="
          () =>
            pastasStore.createPasta(
              {
                tags: pastaStore.pasta.tags,
                text: pastaStore.pasta.text,
              },
              {
                onEnd: pastaStore.pasta.reset,
              },
            )
        "
      />
      <chat-pasta-preview />
    </div>
  </div>
</template>
<script setup lang="ts">
import { set } from "@vueuse/core";

const pastasStore = usePastasStore();
const pastaStore = usePastaStore();

const pastaFormRef = ref();
const isFormCollapseOpen = useIndexedDBKeyValue(
  "create-pasta-form-collapse:is-open",
  false,
);
const toggleFormCollapse = useToggle(isFormCollapseOpen.state);
const closeFormCollapse = () => set(isFormCollapseOpen.state, false);

watch(useMagicKeys().i, async () => {
  isFormCollapseOpen.state.value = true;
  // NOTE: without sleep will be ugly layout shift when collapse become opened
  await sleep(100);
  pastaFormRef.value.pastaFormTextareaRef.textareaRef.focus();
});
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
