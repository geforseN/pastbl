<template>
  <div
    class="fixed bottom-0 right-1/2 translate-x-1/2 rounded-t-btn border-2 border-b-0 bg-base-300 px-2 pb-1.5 pt-1.5 text-center"
    :class="
      userStore.pastasWorkMode.isClient
        ? 'border-secondary'
        : 'border-twitch-accent'
    "
  >
    <div class="flex items-center gap-1">
      Server mode
      <input
        id="pastas-work-mode"
        v-model="userStore.pastasWorkMode.isClient"
        :disabled="!userStore.pastasWorkMode.canHaveServerMode"
        name="pastas-work-mode"
        type="checkbox"
        class="toggle border-secondary bg-secondary [--tglbg:black] hover:bg-secondary/50"
      />
      Client mode
    </div>
    <template v-if="!userStore.pastasWorkMode.canHaveServerMode">
      <div
        v-if="
          userStore.pastasWorkMode.canHaveServerModeStatus.includes(
            'not-logged-in',
          )
        "
      >
        GO LOGIN
      </div>
      <div
        v-if="
          userStore.pastasWorkMode.canHaveServerModeStatus.includes('offline')
        "
      >
        GO ONLINE
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
