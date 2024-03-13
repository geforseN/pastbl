<template>
  <div>
    <pasta-form-edit
      ref="pastaFormEditRef"
      v-model:tag="tag"
      v-model:text="megaPasta.text"
      v-model:tags="megaPasta.tags"
      @accept="onPastaEditAccept"
      @decline="
        () => {
          mustIgnoreRouteLeaveGuard = true;
          navigateTo(localePath('/'));
        }
      "
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
      <chat-pasta-accept-changes-dialog
        ref="acceptChangesDialogRef"
        :tags="megaPasta.tags"
        :text="megaPasta.text"
        :on-success="onPastaEditAccept"
      />
      <chat-pasta-tag-add-dialog
        ref="addTagDialogRef"
        :tag="tag"
        :on-success="
          async () => {
            assert.ok(initialPasta);
            // if below is needed when in edit user remove e.g. 'x' tag and then leaves 'x' in tag input
            const pasta = makeRawPasta(initialPasta);
            if (!pasta.tags.includes(tag)) {
              pasta.tags.push(tag);
            }
            await pastasStore.putPasta(pasta);
            initialPasta = pasta;
            megaPasta.tags.push(tag);
          }
        "
      />
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import type {
  ChatPastaAcceptChangesDialog,
  ChatPastaTagAddDialog,
  PastaFormEdit,
} from "#build/components";

const pastaId = getRouteStringParam("pastaId", Number);
const localePath = useLocalePath();

const pastaFormEditRef = ref<InstanceType<typeof PastaFormEdit>>();
const addTagDialogRef = ref<InstanceType<typeof ChatPastaTagAddDialog>>();
const acceptChangesDialogRef =
  ref<InstanceType<typeof ChatPastaAcceptChangesDialog>>();

const mustIgnoreRouteLeaveGuard = ref(false);

const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();

const initialPasta = ref<IDBMegaPasta>();
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
  const pasta_ = {
    id: pasta.id,
    createdAt: pasta.createdAt,
    lastCopiedAt: pasta.lastCopiedAt,
    text,
    length: pasta.length,
    tags: [...toRaw(pasta.tags)],
    validTokens: makeValidTokens(text),
    updatedAt: Date.now(),
  };
  await pastasStore.putPasta(pasta_);
  initialPasta.value = pasta_;
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
  // FIXME: here also can assign clone to pastaToEdit
  initialPasta.value = pasta;
  megaPasta.value = structuredClone(pasta);
});

onBeforeRouteLeave(async () => {
  if (mustIgnoreRouteLeaveGuard.value) {
    return;
  }
  assert.ok(addTagDialogRef.value);
  await addTagDialogRef.value.execute();
  assert.ok(acceptChangesDialogRef.value && initialPasta.value);
  await acceptChangesDialogRef.value.execute(initialPasta.value);
});
</script>
