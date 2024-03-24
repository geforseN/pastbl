<template>
  <div
    class="collapse collapse-arrow border-2"
    @keyup.enter.exact="userStore.formCollapse.toggle"
  >
    <input
      v-model="userStore.formCollapse.isOpen"
      type="checkbox"
      name="is-create-pasta-open"
    />
    <div class="collapse-title text-xl font-medium after:mt-1">
      <header class="flex justify-between text-3xl font-bold">
        <span class="flex items-center gap-2">
          <kbd class="kbd kbd-sm -ml-0.5 px-2 pb-[1px] pt-0.5">i</kbd>
          <h2>{{ $t("pasta.create.heading") }}</h2>
        </span>
        <transition name="jokerge">
          <div
            v-if="!userStore.formCollapse.isOpen"
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
      @keyup.escape="userStore.formCollapse.close"
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
        @add-tag="(tag) => pastaStore.addTag(tag)"
        @remove-tag="(tag) => pastaStore.pasta.removeTag(tag)"
        @remove-all-tags="() => pastaStore.pasta.removeAllTags()"
        @create-pasta="
          async () => {
            assert.ok(addTagDialogRef);
            await addTagDialogRef.execute();
            await pastasStore.createPasta(
              {
                tags: pastaStore.pasta.tags,
                text: pastaStore.pasta.text,
              },
              {
                onEnd: pastaStore.pasta.reset,
              },
            );
          }
        "
      />
      <button class="btn btn-primary" @click="() => pastaStore.postPasta()">
        POST
      </button>
      <client-only>
        <chat-pasta-preview
          v-show="!!pastaStore.pastaTrimmedText.length"
          :text="pastaStore.pastaTrimmedText"
          :can-populate
        />
      </client-only>
    </div>
    <teleport to="body">
      <chat-pasta-tag-add-dialog
        ref="addTagDialogRef"
        :tag="pastaStore.pasta.tag"
        :on-success="pastaStore.addInputTag"
      />
    </teleport>
  </div>
</template>
<script setup lang="ts">
import type { ChatPastaTagAddDialog, PastaForm } from "#build/components";

const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const emotesStore = useEmotesStore();
const userStore = useUserStore();

const addTagDialogRef = ref<InstanceType<typeof ChatPastaTagAddDialog>>();
const pastaFormRef = ref<InstanceType<typeof PastaForm>>();

async function focusOnTextarea() {
  // NOTE: without sleep will be ugly layout shift when collapse become opened
  await sleep(100);
  pastaFormRef.value!.pastaFormTextareaRef!.textareaRef!.focus();
}

watch(useMagicKeys().i, () => {
  userStore.formCollapse.open();
  focusOnTextarea();
});

whenever(() => userStore.formCollapse.isOpen, focusOnTextarea);

function canPopulate() {
  return Promise.all([
    until(() => pastaStore.text.isRestored).toBeTruthy({
      timeout: 3_000,
    }),
    until(() => emotesStore.canUseUserEmotes).toBeTruthy(),
  ]);
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
