<template>
  <div
    class="flex flex-col rounded-btn border-2 bg-base-300 p-2 text-center"
    :class="
      userStore.pastasWorkMode.isClient
        ? 'border-secondary'
        : 'border-twitch-accent'
    "
  >
    <div class="flex items-center gap-1 self-center">
      {{ $t("server-mode") }}
      <input
        id="pastas-work-mode"
        v-model="userStore.pastasWorkMode.isClient"
        :disabled="
          !userStore.pastasWorkMode.canHaveServerMode &&
          userStore.pastasWorkMode.isClient
        "
        name="pastas-work-mode"
        type="checkbox"
        class="toggle border-secondary bg-secondary [--tglbg:black] hover:bg-secondary/50"
      />
      {{ $t("client-mode") }}
    </div>
    <div
      v-if="!userStore.pastasWorkMode.canHaveServerMode"
      class="flex flex-col"
    >
      <ul>
        <li
          v-if="
            userStore.pastasWorkMode.canHaveServerModeStatus.includes(
              'not-logged-in',
            )
          "
        >
          <samp>
            <auth-twitch-login-btnlink class="btn-xs w-full text-sm" />
          </samp>
        </li>
        <li
          v-if="
            userStore.pastasWorkMode.canHaveServerModeStatus.includes('offline')
          "
        >
          <samp>{{ $t("restore-internet-connection") }}</samp>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
