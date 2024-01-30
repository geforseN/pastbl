<template>
  <div class="relative">
    <button
      v-if="!mustRevealConfirmDeleteDialog"
      ref="deleteButtonRef"
      class="btn btn-error btn-sm border border-error-content"
      @click="
        async () => {
          mustRevealConfirmDeleteDialog = true;
          await nextTick();
          cancelDeleteButtonRef?.focus();
        }
      "
    >
      Delete
      <icon name="ic:round-delete-outline" class="-ml-2" />
    </button>
    <div
      v-else
      class="card card-compact absolute -top-4 left-0 z-[1] w-72 border-2 bg-base-100 p-2 text-base-content"
    >
      <div class="card-body">
        <h3 class="card-title">Delete {{ props.nickname }} collection?</h3>
        <div class="flex gap-2">
          <button class="btn btn-error btn-sm grow" @click="emit('delete')">
            Delete
          </button>
          <button
            ref="cancelDeleteButtonRef"
            class="btn btn-outline btn-sm grow"
            @click="
              async () => {
                mustRevealConfirmDeleteDialog = false;
                await nextTick();
                deleteButtonRef?.focus();
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
const mustRevealConfirmDeleteDialog = ref(false);
const deleteButtonRef = ref<HTMLButtonElement>();
const cancelDeleteButtonRef = ref<HTMLDivElement>();

const props = defineProps<{
  nickname: string;
}>();

const emit = defineEmits<{ delete: [] }>();
</script>
