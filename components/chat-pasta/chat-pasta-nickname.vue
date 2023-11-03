<template>
  <div
    class="overflow-wrap-anywhere -m-[.2rem] inline-block break-all p-[.2rem] align-baseline"
  >
    <div
      v-for="badgeNumber of user.badges.count"
      :key="badgeNumber"
      class="mr-[1.5px] inline-flex h-twitch-badge w-twitch-badge items-center justify-center bg-red-600 align-middle"
    >
      {{ badgeNumber }}
    </div>
    <span
      class="twitch-tex align-baseline text-[13px] font-bold leading-[19.5px]"
      :style="{ color: user.preferences.nickname.color }"
    >
      {{ user.nickname }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const { user } = defineProps<{
  user: ReturnType<typeof useUserStore>["user"];
}>();
</script>
