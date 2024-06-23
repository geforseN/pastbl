<template>
  <section class="divide-y-2 rounded-box border-2 p-2">
    <h2 id="heading" class="p-2 text-3xl font-bold">
      {{ $t("settings.change") }}
    </h2>
    <settings-badges v-model="userStore.user.badges.count.state" />
    <settings-nickname v-model="userStore.user.nickname.text.state" />
    <settings-nickname-color v-model="userStore.user.nickname.color.state" />
    <settings-on-pasta-copy
      v-model="userStore.user.pasta.oncopy.state"
      :options="{
        none: $t('settings.on-pasta-copied.options.none'),
        alert: $t('settings.on-pasta-copied.options.alert'),
        sound: $t('settings.on-pasta-copied.options.sound'),
        'alert&sound': $t('settings.on-pasta-copied.options.alert&sound'),
      }"
    />
    <dev-only>
      <div>
        <!-- Update emotes -->
        <label>Обновление эмоутов</label>
      </div>
    </dev-only>
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
