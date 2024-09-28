<template>
  <div
    class="overflow-wrap-anywhere -m-[.2rem] inline-block break-all p-[0.2rem] align-baseline"
  >
    <div
      v-for="badgeNumber of badgesCount"
      :key="badgeNumber"
      class="mr-[1.5px] inline-flex h-twitch-badge w-twitch-badge items-center justify-center bg-red-600 align-middle text-base"
    >
      {{ badgeNumber }}
    </div>
    <span
      class="twitch-text text-[13px]/[18px] font-bold"
      :style="{ color: nicknameColor }"
    >
      {{ nickname }}
    </span>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  nickname: string;
  nicknameColor: string;
  badgesCount: number;
}>();
</script>
