<template>
  <div class="w-full flex justify-center" v-if="pastaStore.tags.length === 0">
    <span class="bg-warning rounded text-warning-content px-2 py-1 border">No tags were added</span>
  </div>
  <ul v-else class="w-full grid">
    <li class="badge badge-lg bg-secondary flex gap-x-1 w-full" v-for="tag of pastaStore.tags">
      <span>{{ tag }}</span>
      <button class="btn btn-circle block btn-xs text-xs font-normal h-1" @click="pastaStore.removeTag(tag)">
        <span>x</span>
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">

const pastaStore = usePastaStore();
</script>
