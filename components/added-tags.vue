<template>
  <div v-if="pastaStore.tags.length === 0">NO TAGS WERE ADDED</div>
  <ul v-else class="flex w-20 flex-wrap">
    <li class="badge badge-lg bg-secondary flex gap-x-1" v-for="tag of pastaStore.tags">
      <span>{{ tag }}</span>
      <button class="btn btn-circle block btn-xs text-xs font-normal h-1"
        @click="pastaStore.removeTag(tag)">
        <span>x</span>
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">

const pastaStore = usePastaStore();
</script>
