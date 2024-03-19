<template>
  <div class="relative">
    <slot
      ref="deleteButtonRef"
      name="default"
      :reveal-dialog="
        () => {
          mustRevealConfirmDeleteDialog = true;
          nextTick(() => {
            cancelButtonRef!.focus();
          });
        }
      "
    />
    <div
      v-if="mustRevealConfirmDeleteDialog"
      class="card card-compact absolute z-[1] w-72 border-2 bg-base-100 p-2 text-base-content"
      :class="$attrs"
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
            {{ $t("collections.users.ready.button.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const deleteButtonRef = ref<HTMLButtonElement>();
const cancelButtonRef = ref<HTMLDivElement>();
const cardRef = ref<HTMLDivElement>();

const mustRevealConfirmDeleteDialog = ref(false);

const emit = defineEmits<{ delete: [] }>();

onClickOutside(cardRef, () => {
  mustRevealConfirmDeleteDialog.value = false;
});
</script>
