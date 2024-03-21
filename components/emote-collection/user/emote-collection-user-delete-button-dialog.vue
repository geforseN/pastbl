<template>
  <div ref="containerRef" class="relative">
    <slot
      :reveal-dialog="
        () => {
          isDialogRevealed = true;
          nextTick(() => {
            cancelButtonRef!.focus();
          });
        }
      "
      :is-dialog-revealed
    />
    <div
      v-show="isDialogRevealed"
      class="card card-compact absolute z-[1] w-72 border-2 bg-base-100 p-2 text-base-content"
      v-bind="$attrs"
    >
      <div ref="cardRef" class="card-body">
        <h3 class="card-title">
          {{ $t("collections.users.ready.delete-text") }}
        </h3>
        <div class="flex gap-2">
          <button class="btn btn-error btn-sm grow" @click="emit('delete')">
            {{ $t("delete") }}
          </button>
          <button
            ref="cancelButtonRef"
            class="btn btn-outline btn-sm grow focus:outline focus:outline-offset-2 focus:outline-primary"
            @click="
              () => {
                isDialogRevealed = false;
                nextTick(() => {
                  setFocusOnDeleteButton();
                });
              }
            "
          >
            {{ $t("collections.users.ready.button.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const containerRef = ref<HTMLDivElement>();
const cardRef = ref<HTMLDivElement>();
const cancelButtonRef = ref<HTMLButtonElement>();
const isDialogRevealed = ref(false);

const emit = defineEmits<{
  delete: [];
}>();

onClickOutside(cardRef, () => {
  isDialogRevealed.value = false;
});

function setFocusOnDeleteButton() {
  assert.ok(containerRef.value);
  const deleteButton = containerRef.value.firstElementChild;
  assert.ok(deleteButton instanceof HTMLButtonElement);
  deleteButton.focus();
}
</script>
