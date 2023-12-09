<template>
  <section class="divide-y-2 rounded-box border-2 p-2">
    <h2 id="user-settings-heading" class="p-2 text-3xl font-bold">
      Change settings
    </h2>
    <user-settings-badges v-model="userStore.user.badges.count" />
    <user-settings-nickname v-model="userStore.user.nickname" />
    <user-settings-nickname-color v-model="userStore.nicknameColor" />
    <div class="form-control p-2">
      <label for="pasta-oncopy" class="label cursor-pointer text-xl font-medium"
        >When pasta copied</label
      >
      <select
        id="pasta-oncopy"
        v-model="userStore.user.preferences.pasta.oncopy"
        class="select select-secondary"
        name="pasta-oncopy"
      >
        <option value="none">Do nothing</option>
        <option value="alert">Show alert</option>
        <option value="sound">Play sound</option>
        <option value="alert sound">Show alert & Play sound</option>
      </select>
    </div>
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
