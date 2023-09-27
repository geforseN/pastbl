<template>
  <div class="inline-block -m-0.5">
    <div v-for="i of user.badges.count" class="w-[18px] h-[18px] bg-red-600 inline-block mr-[1.5px]">{{ i }}</div>
    <span :class="`text-${user.preferences.nickname.color}-500`"
      class="nickname font-bold text-[13px] leading-[19.5px] break-all align-baseline ">
      {{ user.nickname }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const { user } = defineProps<{
  user: {
    nickname: string,
    badges: { count: number }
    preferences: {
      nickname: { color: string },
    }
  }
}>();
</script>

<style scoped>
.nickname {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
  /*  */
  cursor: pointer;

}
</style>

