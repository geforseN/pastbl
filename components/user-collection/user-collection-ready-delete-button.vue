<template>
  <div class="relative">
    <button
      v-if="!mustRevealConfirmDeleteDialog"
      ref="deleteButtonRef"
      :class="props.buttonClass"
      @click="
        () => {
          mustRevealConfirmDeleteDialog = true;
          nextTick(() => {
            cancelDeleteButtonRef?.focus();
          });
        }
      "
    >
      Delete
      <icon name="ic:round-delete-outline" class="-ml-2" />
    </button>
    <div v-else :class="props.cardClass">
      <div ref="cardRef" class="card-body">
        <h3 class="card-title">Delete {{ props.nickname }} collection?</h3>
        <div class="flex gap-2">
          <button class="btn btn-error btn-sm grow" @click="emit('delete')">
            Delete
          </button>
          <button
            ref="cancelDeleteButtonRef"
            class="btn btn-outline btn-sm grow"
            @click="
              () => {
                mustRevealConfirmDeleteDialog = false;
                nextTick(() => {
                  deleteButtonRef?.focus();
                });
              }
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const deleteButtonRef = ref<HTMLButtonElement>();
const cancelDeleteButtonRef = ref<HTMLDivElement>();
const cardRef = ref<HTMLDivElement>();

const props = withDefaults(
  defineProps<{
    nickname: string;
    buttonClass?: string;
    cardClass?: string;
  }>(),
  {
    buttonClass: "btn btn-error btn-sm border border-error-content",
    cardClass:
      "card card-compact absolute -top-4 left-0 z-[1] w-72 border-2 bg-base-100 p-2 text-base-content",
  },
);

const emit = defineEmits<{ delete: [] }>();

const mustRevealConfirmDeleteDialog = ref(false);
onClickOutside(cardRef, () => {
  mustRevealConfirmDeleteDialog.value = false;
});
</script>
