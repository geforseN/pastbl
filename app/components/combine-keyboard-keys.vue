<template>
  <span class="flex flex-nowrap items-center gap-0.5 text-nowrap text-xs">
    <kbd class="kbd pt-1">{{ first }}</kbd>
    +
    <kbd class="kbd pt-1">{{ last }}</kbd>
  </span>
</template>
<script setup>
defineProps<{
  first: string;
  last: string;
}>();
</script>
