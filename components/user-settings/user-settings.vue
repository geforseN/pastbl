<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change user settings</h2>
    <user-settings-badges v-model="userStore.user.badges.count" />
    <user-settings-nickname v-model="userStore.user.nickname" />
    <user-settings-nickname-color
      v-model="userStore.preferences.nickname.color"
    />
    <user-settings-alerts
      v-model:pasta-copied="
        userStore.user.preferences.alerts.copypastaCopy.mustShowOnSuccess
      "
    />
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
<style scoped>
article:focus-within {
  position: relative;
  background-color: theme(colors.base-300);
}

article:focus-within::before,
article:focus-within::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.5rem;
  background-color: theme(colors.base-300);
}

article:focus-within::before {
  left: -0.5rem;
}

article:focus-within::after {
  right: -0.5rem;
}
</style>
