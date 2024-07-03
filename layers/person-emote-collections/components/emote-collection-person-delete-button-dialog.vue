<template>
  <div ref="containerRef" class="relative">
    <slot
      :reveal="
        () => {
          isRevealed = true;
          nextTick(() => {
            cancelButtonRef!.focus();
          });
        }
      "
      :is-revealed
    />
    <div
      v-show="isRevealed"
      class="card card-compact absolute z-[1] w-72 border-2 bg-base-100 p-2 text-base-content"
      v-bind="$attrs"
    >
      <div ref="cardRef" class="card-body">
        <h3 class="card-title">
          {{ $t("collections.users.ready.delete-text") }}
        </h3>
        <div class="flex gap-2">
          <button class="btn btn-error btn-sm grow" @click="$emit('delete')">
            {{ $t("delete") }}
          </button>
          <button
            ref="cancelButtonRef"
            class="btn btn-outline btn-sm grow focus:outline focus:outline-offset-2 focus:outline-primary"
            @click="
              () => {
                isRevealed = false;
                nextTick(() => {
                  setFocusOnDeleteButton();
                });
              }
            "
          >
            {{ $t("cancel") }}
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
const isRevealed = ref(false);

defineEmits<{
  delete: [];
}>();

onClickOutside(cardRef, () => {
  isRevealed.value = false;
});

function setFocusOnDeleteButton() {
  assert.ok(containerRef.value);
  const deleteButton = containerRef.value.firstElementChild;
  assert.ok(deleteButton instanceof HTMLButtonElement);
  deleteButton.focus();
}
</script>
