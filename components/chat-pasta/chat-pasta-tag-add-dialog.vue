<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ $t("modal.chatPastaTagAdd.heading") }}
      </h3>
      <p class="py-4">{{ $t("modal.chatPastaTagAdd.body") }}</p>
      {{ $t("modal.chatPastaTagAdd.tag") }}: {{ props.tag }}
      <form method="dialog" class="modal-action" @submit.prevent>
        <button
          class="btn btn-error"
          type="reset"
          @click="emit('mustAddTag', false)"
        >
          {{ $t("modal.chatPastaTagAdd.decline") }}
        </button>
        <button
          class="btn btn-success"
          type="submit"
          @click="emit('mustAddTag', true)"
        >
          {{ $t("modal.chatPastaTagAdd.accept") }}
        </button>
      </form>
    </div>
  </dialog>
</template>
<script setup lang="ts">
const props = defineProps<{
  tag: string;
}>();

const emit = defineEmits<{
  mustAddTag: [boolean];
}>();

const dialogRef = ref<HTMLDialogElement>();

defineExpose({
  dialogRef,
});
</script>
