<template>
  <section class="rounded-box divide-y-2 border-2 p-2">
    <h2
      id="heading"
      class="p-2 text-3xl font-bold"
    >
      {{ $t("settings.change") }}
    </h2>
    <settings-badges v-model="userStore.user.badges.count.state" />
    <settings-nickname v-model="userStore.user.nickname.text.state" />
    <settings-nickname-color v-model="userStore.user.nickname.color.state" />
    <settings-on-pasta-copy
      v-model="userStore.user.pasta.oncopy.state"
      :options="{
        'none': $t('settings.on-pasta-copied.options.none'),
        'alert': $t('settings.on-pasta-copied.options.alert'),
        'sound': $t('settings.on-pasta-copied.options.sound'),
        'alert&sound': $t('settings.on-pasta-copied.options.alert&sound'),
      }"
    />
    <settings-emotes-refresh
      v-model="
        userStore.emotesIntegrationsRefreshInterval.refreshInterval.myTimeString
      "
      :options="{
        '15m': $t('myTimeString.m.15'),
        '30m': $t('myTimeString.m.30'),
        '45m': $t('myTimeString.m.45'),
        '1h': $t('myTimeString.h.1'),
        '6h': $t('myTimeString.h.6'),
        '12h': $t('myTimeString.h.12'),
        '1d': $t('myTimeString.d.1'),
        '3d': $t('myTimeString.d.3'),
        '7d': $t('myTimeString.d.7'),
      }"
    />
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
<style scoped>
.form-control:focus-within {
  position: relative;
  border-color: theme(colors.base-content);
  background-color: theme(colors.base-300);
}

.form-control:focus-within + .form-control {
  border-top-color: theme(colors.base-content);
}

.form-control:focus-within::before,
.form-control:focus-within::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.5rem;
  background-color: theme(colors.base-300);
}

.form-control:focus-within::before {
  left: -0.5rem;
}

.form-control:focus-within::after {
  right: -0.5rem;
}
</style>
