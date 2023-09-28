<template>
  <div class="join mt-2 w-full">
    <input type="text" id="add-tag" @keyup.enter="emit('addTag')" v-model="modelValue" placeholder="Enter a pasta tag"
      class="input input-bordered w-full border-base-content join-item bg-opposite placeholder:text-base-content" />
    <button
      class="px-0 join-item btn w-[170px] text-3xl border border-base-content hover:border hover:border-base-content hover:bg-secondary/5"
      @click="emit('addTag')">
      <span class="inline-flex gap-x-1 items-center">
        +
        <span class="text-base">add tag</span>
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>();
const emit = defineEmits<{ addTag: [tag?: string] }>();
</script>