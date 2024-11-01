<template>
  <div class="flex items-center justify-between gap-1 border-base-content bg-base-100 px-2 text-base-content">
    <label
      :for="id"
      class="cursor-pointer"
    >
      {{ label }}
    </label>
    <input
      :id
      v-model="color"
      type="color"
      class="input m-0 h-8 w-6 cursor-pointer p-0"
    />
  </div>
</template>
<script setup lang="ts">
const color = defineModel<string>({ required: true });

defineProps<{
  label: string;
}>();

const id = useId();
</script>
