<template>
  <div
    data-testid="pasta-form-collapse"
    class="collapse-arrow collapse border-2"
    :class="
      !$formCollapse.isOpen
        ? null
        : userStore.pastasWorkMode.isLocal
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
                userStore.pastasWorkMode.isLocal
                  ? "Create local pasta"
                  : "Publish remote pasta",
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
              class="size-8 translate-y-1"
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
      class="collapse-content xs:px-3 space-y-2 px-1"
      @keyup.escape="$formCollapse.close"
      @keyup.stop="
        () => {
          // NOTE: stop propagation is important to prevent collapse from closing
          // (when user press 'i' in pasta textarea or in tag input)
          // FIXME: add test for that situation
        }
      "
    >
      <pasta-form
        ref="pastaForm"
        v-model:tag="pastaStore.pasta.tag"
        v-model:text="pastaStore.pasta.text"
        v-model:is-public="pastaStore.publishPasta.isPublicPasta.state"
        :pasta-tags="pastaStore.pasta.tags"
        :hinted-tags-map="pastasStore.pastasTags.sortedEntriesByPopularity"
        @add-tag="(tag) => pastaStore.addTag(tag)"
        @remove-tag="(tag) => pastaStore.pasta.removeTag(tag)"
        @remove-all-tags="() => pastaStore.pasta.removeAllTags()"
        @create-pasta="createPasta"
        @publish-pasta="publishRemotePasta"
      />
      <client-only>
        <chat-pasta-preview
          v-show="pastaStore.pastaTrimmedText.length > 0"
          :text="pastaStore.pastaTrimmedText"
          :can-populate
        />
      </client-only>
    </div>
    <teleport to="#teleports">
      <chat-pasta-tag-add-dialog
        ref="addTagDialog"
        :tag="pastaStore.pasta.tag"
        :on-success="pastaStore.addInputTag"
      />
    </teleport>
  </div>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const emotesStore = useEmotesStore();
const userStore = useUserStore();

const addTagDialogRef = useTemplateRef("addTagDialog");
const pastaFormRef = useTemplateRef("pastaForm");

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

const toast = useActionToasts();

async function createPasta() {
  assert.ok(addTagDialogRef);
  await addTagDialogRef.value!.execute();
  await pastasStore.createPasta(pastaStore.pasta);
  pastaStore.pasta.reset();
}

async function publishRemotePasta() {
  // TODO: add loading state
  const { pasta } = await pastaStore.postPasta();
  pastasStore.__remotePastas = [
    {
      id: pasta.id,
      text: pasta.text,
      publishedAt: pasta.publishedAt,
      tags: pasta.tags,
    },
    ...pastasStore.__remotePastas,
  ];
  toast.add(() => ({ title: "Pasta posted!", type: "success" }));
  pastaStore.pasta.reset();
};

async function canPopulate() {
  await Promise.all([
    until(() => pastaStore.text.isRestored).toBeTruthy({
      timeout: 3000,
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
