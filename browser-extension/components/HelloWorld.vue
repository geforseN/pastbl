<template>
  <div class="flex flex-col items-center">
    <!-- eslint-disable tailwindcss/no-custom-classname -->
    <button
      type="button"
      class="btn btn-primary btn-sm w-fit"
      @click="count++"
    >
      pastbl
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  msg: string;
}>();

const count = ref(0);
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
