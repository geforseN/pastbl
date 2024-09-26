<template>
  <div
    class="flex flex-col rounded-btn border-2 bg-base-300 p-2 text-center"
    :class="
      userStore.pastasWorkMode.isRemote
        ? 'border-secondary'
        : 'border-twitch-accent'
    "
  >
    <div class="flex items-center gap-1 self-center">
      {{ $t("remote-mode") }}
      <input
        id="pastas-work-mode"
        v-model="userStore.pastasWorkMode.isLocal"
        :disabled="
          !userStore.pastasWorkMode.canBeRemote &&
          userStore.pastasWorkMode.isLocal
        "
        name="pastas-work-mode"
        type="checkbox"
        class="toggle border-secondary bg-secondary [--tglbg:black] hover:bg-secondary/50"
      />
      {{ $t("local-mode") }}
    </div>
    <div v-if="!userStore.pastasWorkMode.canBeRemote" class="flex flex-col">
      <ul>
        <li
          v-if="
            userStore.pastasWorkMode.remoteBlockStatusIncludes('not-logged-in')
          "
        >
          <samp>
            <auth-twitch-login-link-button class="btn-xs w-full text-sm" />
          </samp>
        </li>
        <li
          v-if="userStore.pastasWorkMode.remoteBlockStatusIncludes('offline')"
        >
          <samp>{{ $t("restore-internet-connection") }}</samp>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
const userStore = useUserStore();
</script>
<style scoped>
input#pastas-work-mode:not(:checked) {
  background-color: theme(colors.twitch-accent);
  border-color: theme(colors.twitch-accent);
}

input#pastas-work-mode:not(:checked):hover {
  background-color: theme(colors.secondary/80%);
}

input#pastas-work-mode:checked:hover {
  background-color: theme(colors.twitch-accent/80%);
}
</style>
