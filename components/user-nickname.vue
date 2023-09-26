<template>
  <span>{{ user.nickname }}</span>
</template>

<script lang="ts" setup>
const { user } = defineProps<{ user: { nickname: string } }>();
</script>
