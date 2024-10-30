<template>
  <div class="flex flex-col items-center">
    <!-- eslint-disable tailwindcss/no-custom-classname -->
    <button
      type="button"
      class="btn btn-primary btn-sm w-fit"
    >
      pastbl
    </button>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  msg: string;
}>();
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
