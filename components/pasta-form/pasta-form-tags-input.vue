<template>
  <div class="join w-full">
    <input
      class="input join-item input-bordered box-content w-full border-base-content placeholder:text-base-content xl:w-auto xl:min-w-[320px]"
      id="add-tag"
      v-model="modelValue"
      type="text"
      @keyup.enter.prevent="emitTag"
      placeholder="Enter a pasta tag (optional)"
      list="add-tag-suggestions"
    />

    <datalist id="add-tag-suggestions">
      <slot name="addTagSuggestions" />
    </datalist>
    <button
      class="btn btn-secondary join-item box-content border border-base-content px-2 text-3xl text-base-content hover:border hover:border-base-content hover:bg-secondary/5 xl:min-w-[160px] xl:px-0"
      @click.prevent="emitTag"
    >
      +
      <span class="text-base">add tag</span>
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const { shouldBecomeEmptyOnAdd = false } = defineProps<{
  shouldBecomeEmptyOnAdd?: boolean;
}>();
const emit = defineEmits<{ addTag: [tagToAdd: string] }>();

defineSlots<{
  addTagSuggestions: () => any;
}>();

function emitTag() {
  emit("addTag", modelValue.value);
  if (shouldBecomeEmptyOnAdd) {
    modelValue.value = "";
  }
}
</script>
