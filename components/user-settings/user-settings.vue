<template>
  <section class="divide-y-2 rounded-box border-2 p-2">
    <h2 id="user-settings-heading" class="p-2 text-3xl font-bold">
      Change settings
    </h2>
    <user-settings-badges v-model="userStore.user.badges.count" />
    <user-settings-nickname v-model="userStore.user.nickname" />
    <user-settings-nickname-color v-model="userStore.nicknameColor" />
    <user-settings-alerts
      v-model:pasta-copied="
        userStore.user.preferences.alerts.copypastaCopy.mustShowOnSuccess
      "
    />
    <div>
      <fieldset class="rounded border-2 p-2">
        <legend class="-ml-1 -translate-x-1 pl-2 text-xl">
          Play sound on:
        </legend>
        <article class="flex items-center justify-between rounded px-2">
          <label
            for="must-play-sound-pasta-copied"
            class="label cursor-pointer text-xl font-medium"
          >
            <h3>Pasta Copied</h3>
          </label>
          <input
            id="must-play-sound-pasta-copied"
            v-model="
              userStore.user.preferences.sounds.copypastaCopy.mustSoundOnSuccess
            "
            class="toggle toggle-secondary"
            name="must-show-alert-pasta-copied"
            type="checkbox"
            label="Pasta Created"
          />
        </article>
      </fieldset>
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
