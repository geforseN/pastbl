<template>
  <span>
    {{ before }}
    <slot />
    {{ after }}
  </span>
</template>
<script setup lang="ts">
defineProps<{
  before: string;
  after: string;
}>();
</script>
