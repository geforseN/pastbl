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
      <dialog ref="routeGuardModalRef" class="modal">
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
  </div>
</template>
<script lang="ts" setup>
import type { PastaFormEdit } from "#build/components";

const pastaId = getRouteStringParam("pastaId", Number);
const localePath = useLocalePath();

const pastaFormEditRef = ref<InstanceType<typeof PastaFormEdit>>();
const routeGuardModalRef = ref<HTMLDialogElement>();
const mustAcceptChanges = ref<boolean | null>(null);

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

onBeforeRouteLeave(async () => {
  assert.ok(routeGuardModalRef.value && pastaToEdit.value && megaPasta.value);
  const isTextSame = pastaToEdit.value.text === megaPasta.value.text;
  const isTagsSame =
    pastaToEdit.value.tags.toString() === megaPasta.value.tags.toString();
  if (!isTextSame || !isTagsSame) {
    routeGuardModalRef.value.showModal();
    await until(() => mustAcceptChanges.value).not.toBeNull();
    if (mustAcceptChanges.value) {
      await onPastaEditAccept();
    }
    routeGuardModalRef.value.close();
  }
});
</script>
