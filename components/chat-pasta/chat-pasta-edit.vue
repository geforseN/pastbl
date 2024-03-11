<template>
  <div>
    <pasta-form-edit
      ref="pastaFormEditRef"
      v-model:tag="tag"
      v-model:text="megaPasta.text"
      v-model:tags="megaPasta.tags"
      @accept="onPastaEditAccept"
      @decline="navigateTo(localePath('/'))"
      @add-tag="
        (newTag) => {
          pasta.addTag(newTag);
          tag = '';
        }
      "
      @remove-tag="(tag) => pasta.removeTag(tag)"
      @remove-all-tags="() => pasta.removeAllTags()"
    />
    <client-only>
      <chat-pasta-preview
        v-show="!!trimmedText.length"
        :text="trimmedText"
        :can-populate
      />
    </client-only>
    <teleport to="body">
      <dialog ref="routeGuardDialogRef" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">
            {{ $t("modal.chatPastaEdit.heading") }}
          </h3>
          <p class="py-4">{{ $t("modal.chatPastaEdit.body") }}</p>
          <form method="dialog" class="modal-action" @submit.prevent>
            <button
              class="btn btn-error"
              type="reset"
              @click="mustAcceptChanges = false"
            >
              {{ $t("modal.chatPastaEdit.decline") }}
            </button>
            <button
              class="btn btn-success"
              type="submit"
              @click="mustAcceptChanges = true"
            >
              {{ $t("modal.chatPastaEdit.accept") }}
            </button>
          </form>
        </div>
      </dialog>
    </teleport>
    <teleport to="body">
      <chat-pasta-tag-add-dialog
        ref="addTagDialogRef"
        :tag="tag"
        @must-add-tag="(value) => (mustAddTag = value)"
      />
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import type { ChatPastaTagAddDialog, PastaFormEdit } from "#build/components";

const pastaId = getRouteStringParam("pastaId", Number);
const localePath = useLocalePath();

const pastaFormEditRef = ref<InstanceType<typeof PastaFormEdit>>();
const addTagDialogRef = ref<InstanceType<typeof ChatPastaTagAddDialog>>();
const routeGuardDialogRef = ref<HTMLDialogElement>();

const mustAcceptChanges = ref<boolean | null>(null);
const mustAddTag = ref<boolean | null>(null);

const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();

const pastaToEdit = ref<IDBMegaPasta>();
const megaPasta = ref<IDBMegaPasta>({
  ...createMegaPasta("", []),
  id: -1,
});
const tag = ref("");

const pasta = usePasta({
  tag,
  text: writableComputedForKey(megaPasta, "text"),
  tags: writableComputedForKey(megaPasta, "tags"),
});

const trimmedText = ref(megaPasta.value.text);
watchDebounced(
  () => megaPasta.value.text,
  (text) => {
    trimmedText.value = megaTrim(text);
  },
  { debounce: 200 },
);

async function onPastaEditAccept() {
  const pasta = toValue(megaPasta);
  assert.ok(pasta);
  const text = toValue(trimmedText);
  await pastasStore.putPasta({
    id: pasta.id,
    createdAt: pasta.createdAt,
    lastCopiedAt: pasta.lastCopiedAt,
    text,
    length: pasta.length,
    tags: [...toRaw(pasta.tags)],
    validTokens: makeValidTokens(text),
    updatedAt: Date.now(),
  });
}

async function canPopulate() {
  await Promise.all([
    until(() => pastasStore.pastas.isReady).toBeTruthy({ timeout: 3_000 }),
    until(() => emotesStore.isInitialUserEmotesReady).toBeTruthy({
      timeout: 3_000,
    }),
  ]);
  await nextTick();
}

onMounted(async () => {
  await canPopulate();
  pastaFormEditRef.value?.pastaFormTextareaRef.textareaRef.focus();
  const pasta = pastasStore.getPastaById(pastaId);
  pastaToEdit.value = pasta;
  megaPasta.value = structuredClone(pasta);
});

// FIXME: refactor callback (also need to refactor dialogs code)
onBeforeRouteLeave(async () => {
  assert.ok(routeGuardDialogRef.value && pastaToEdit.value && megaPasta.value);
  if (tag.value.length) {
    assert.ok(addTagDialogRef.value?.dialogRef);
    addTagDialogRef.value.dialogRef.showModal();
    await until(mustAddTag).not.toBeNull();
    if (mustAddTag.value) {
      const mustPreventAddSameTag = !pastaToEdit.value.tags.includes(tag.value);
      // if below is needed when in edit user remove e.g. 'x' tag and then leaves 'x' in tag input
      if (mustPreventAddSameTag) {
        pastaToEdit.value.tags.push(tag.value);
      }
      const pasta = makeRawPasta(pastaToEdit.value);
      await pastasStore.putPasta(pasta);
      megaPasta.value.tags.push(tag.value);
    }
    addTagDialogRef.value.dialogRef.close();
  }
  const isTextSame = pastaToEdit.value.text === megaPasta.value.text;
  const isTagsSame =
    pastaToEdit.value.tags.toString() === megaPasta.value.tags.toString();
  if (!isTextSame || !isTagsSame) {
    routeGuardDialogRef.value.showModal();
    await until(mustAcceptChanges).not.toBeNull();
    if (mustAcceptChanges.value) {
      await onPastaEditAccept();
    }
    routeGuardDialogRef.value.close();
  }
});
</script>
