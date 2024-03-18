<template>
  <dialog ref="dialogRef" class="modal">
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
          {{ $t("changes.decline") }}
        </button>
        <button
          class="btn btn-success"
          type="submit"
          @click="mustAcceptChanges = true"
        >
          {{ $t("changes.accept") }}
        </button>
      </form>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
const mustAcceptChanges = ref<boolean | null>(null);
const dialogRef = ref<HTMLDialogElement>();

const props = defineProps<{
  tags: string[];
  text: string;
  onSuccess: () => MaybePromise<void>;
}>();

const isTextSame = isPastaTextSame.bind(props);
const isTagsSame = isPastaTagsSame.bind(props);

defineExpose({
  async execute(pasta: IDBMegaPasta) {
    if (isTextSame(pasta) && isTagsSame(pasta)) {
      return;
    }
    assert.ok(dialogRef.value);
    dialogRef.value.showModal();
    await until(mustAcceptChanges).not.toBeNull();
    if (mustAcceptChanges.value) {
      await props.onSuccess();
    }
    dialogRef.value.close();
  },
});
</script>
