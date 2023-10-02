<template>
  <div class="join w-full">
    <input
      type="text"
      id="add-tag"
      @keyup.enter.prevent="emitTag"
      v-model="modelValue"
      placeholder="Enter a pasta tag (optional)"
      class="input input-bordered box-content w-full xl:w-auto xl:min-w-[320px] border-base-content join-item placeholder:text-base-content"
    />
    <button
      class="join-item btn text-3xl box-content xl:min-w-[120px] border border-base-content hover:border hover:border-base-content hover:bg-secondary/5"
      @click.prevent="emitTag"
    >
      +
      <span class="text-base">add tag</span>
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const { shouldBecomeEmpty = false } = defineProps<{
  shouldBecomeEmpty?: boolean;
}>();
const emit = defineEmits<{ addTag: [tagToAdd: string] }>();

function emitTag() {
  emit("addTag", modelValue.value);
  if (shouldBecomeEmpty) {
    modelValue.value = "";
  }
}
</script>
