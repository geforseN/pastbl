<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ $t("modal.chatPastaTagAdd.heading") }}
      </h3>
      <p class="py-4">{{ $t("modal.chatPastaTagAdd.body") }}</p>
      {{ $t("tag._", props.tag) }}
      <form method="dialog" class="modal-action" @submit.prevent>
        <button class="btn btn-error" type="reset" @click="mustAddTag = false">
          {{ $t("pasta.addTo") }}
        </button>
        <button
          class="btn btn-success"
          type="submit"
          @click="mustAddTag = true"
        >
          {{ $t("nothing") }}
        </button>
      </form>
    </div>
  </dialog>
</template>
<script setup lang="ts">
const props = defineProps<{
  tag: string;
  onSuccess: () => MaybePromise<void>;
}>();

const mustAddTag = ref<boolean | null>(null);
const dialogRef = useTemplateRef("dialog");

defineExpose({
  async execute() {
    if (props.tag.length === 0) {
      return;
    }
    assert.ok(dialogRef.value);
    dialogRef.value.showModal();
    await until(mustAddTag).not.toBeNull();
    if (mustAddTag.value) {
      await props.onSuccess();
    }
    dialogRef.value.close();
  },
});
</script>
