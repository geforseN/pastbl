<template>
  <div class="-m-[.2rem] align-baseline break-all inline-block p-[.2rem] overflowWrapAnywhere">
    <div v-for="i of user.badges.count" class="inline-block w-[18px] h-[18px] align-middle bg-red-600 mr-[1.5px]">{{ i }}</div>
    <span :class="`text-${user.preferences.nickname.color}-500`"
      class="nickname font-bold text-[13px] leading-[19.5px] align-baseline ">
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
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
  /* cursor: pointer; */
}

.overflowWrapAnywhere {
  overflow-wrap: anywhere;
}
</style>

