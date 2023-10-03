<template>
  <div class="join w-full">
    <input
      type="text"
      id="add-tag"
      @keyup.enter.prevent="emitTag"
      v-model="modelValue"
      placeholder="Enter a pasta tag (optional)"
      class="join-item input input-bordered box-content xl:w-auto w-full xl:min-w-[320px] border-base-content placeholder:text-base-content"
    />
    <button
      class="join-item btn text-3xl box-content px-2 xl:px-0 xl:min-w-[160px] border border-base-content hover:border hover:border-base-content hover:bg-secondary/5"
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
