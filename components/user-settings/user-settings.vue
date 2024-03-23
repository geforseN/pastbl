<template>
  <section class="divide-y-2 rounded-box border-2 p-2">
    <h2 id="heading" class="p-2 text-3xl font-bold">{{ $t(s + "heading") }}</h2>
    <user-settings-badges v-model="userStore.user.badges.count.state" />
    <user-settings-nickname v-model="userStore.user.nickname.text.state" />
    <user-settings-nickname-color
      v-model="userStore.user.nickname.color.state"
    />
    <!-- TODO: use aria-describedby for hint -->
    <!-- TODO: add 'must ask before pasta delete' radio input -->
    <!-- TODO: add 'must ask before pasta delete (time to ignore)' range input -->
    <user-settings-on-pasta-copy
      v-model="userStore.user.pasta.oncopy.state"
      :options="{
        none: $t(wo + 'none'),
        alert: $t(wo + 'alert'),
        sound: $t(wo + 'sound'),
        'alert&sound': $t(wo + 'alert&sound'),
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
<script lang="ts">
export const s = "user.settings." as const;
const wo = "user.settings.when.pasta-copied.options." as const;
</script>
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
