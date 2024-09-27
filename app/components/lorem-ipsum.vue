<template>
  <div v-for="number of count" :key="number">
    {{ number + ")" }} Lorem ipsum, dolor sit amet consectetur adipisicing elit.
    Debitis quisquam, repellendus asperiores explicabo, modi quibusdam
    distinctio qui quaerat reiciendis temporibus, consequuntur omnis quod rerum
    repudiandae beatae inventore nemo facere fuga?
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number;
  }>(),
  { count: 10 },
);
</script>
