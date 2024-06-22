<template>
  <div
    class="collapse collapse-arrow border-2"
    :class="
      !$formCollapse.isOpen
        ? null
        : userStore.pastasWorkMode.isClient
          ? 'border-secondary'
          : 'border-twitch-accent'
    "
    @keyup.enter.exact="$formCollapse.toggle"
  >
    <input
      v-model="$formCollapse.isOpen"
      type="checkbox"
      name="is-create-pasta-open"
    />
    <div class="collapse-title text-xl font-medium after:mt-1">
      <header class="flex justify-between text-3xl font-bold">
        <span class="flex items-center gap-2">
          <kbd class="kbd kbd-sm -ml-0.5 px-2 pb-px pt-0.5">i</kbd>
          <h2>
            {{
              $t(
                userStore.pastasWorkMode.isClient
                  ? "pasta.create"
                  : "pasta.publish",
              )
            }}
          </h2>
        </span>
        <transition name="jokerge">
          <div
            v-if="!$formCollapse.isOpen"
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
      class="collapse-content space-y-2 px-1 xs:px-3"
      @keyup.escape="$formCollapse.close"
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
        v-model:is-public="pastaStore.publishPasta.isPublicPasta.state"
        :pasta-tags="pastaStore.pasta.tags"
        :hinted-tags-map="pastasStore.pastasTags.sortedEntriesByPopularity"
        @add-tag="(tag) => pastaStore.addTag(tag)"
        @remove-tag="(tag) => pastaStore.pasta.removeTag(tag)"
        @remove-all-tags="() => pastaStore.pasta.removeAllTags()"
        @create-pasta="
          async () => {
            assert.ok(addTagDialogRef);
            await addTagDialogRef.execute();
            await pastasStore.createPasta(pastaStore.pasta);
            pastaStore.pasta.reset();
          }
        "
        @publish-pasta="
          async () => {
            // TODO: add loading state
            await pastaStore.postPasta();
            useNuxtToast().add({ title: 'Pasta posted!' });
            pastaStore.pasta.reset();
          }
        "
      />
      <client-only>
        <chat-pasta-preview
          v-show="pastaStore.pastaTrimmedText.length > 0"
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

const { $formCollapse } = useNuxtApp();

watch(useMagicKeys().i, () => {
  $formCollapse.open();
  focusOnTextarea();
});
whenever(() => $formCollapse.isOpen, focusOnTextarea);

async function canPopulate() {
  await Promise.all([
    until(() => pastaStore.text.isRestored).toBeTruthy({
      timeout: 3_000,
    }),
    until(() => emotesStore.canUseUserEmotes).toBeTruthy(),
  ]);
  return true;
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
