<template>
  <span class="px-1.5">
    Pasta length:
    <span v-bind="$attrs">
      {{ pastaText.length }}
    </span>
  </span>
</template>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });
defineProps<{ pastaText: string }>();
</script>
