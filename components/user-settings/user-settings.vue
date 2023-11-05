<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change user settings</h2>
    <div class="grid grid-cols-1 divide-y">
      <article class="form-control p-2">
        <label
          class="label cursor-pointer text-xl font-medium"
          for="badges-count"
        >
          <h3>Badges count</h3>
        </label>
        <user-settings-badges-count
          v-model:badges-count.number="userStore.user.badges.count"
        />
      </article>
      <article class="form-control p-2">
        <label class="label cursor-pointer text-xl font-medium" for="nickname">
          <h3>Nickname</h3>
        </label>
        <input
          id="nickname"
          v-model="userStore.user.nickname"
          class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
          spellcheck="false"
          name="nickname"
          placeholder="e.g. Kappa"
        />
      </article>
    </div>
    <article class="form-control p-2">
      <label
        class="label cursor-pointer text-xl font-medium"
        for="nickname-color"
      >
        <h3>Nickname Color</h3>
      </label>
      <input
        id="nickname-color"
        v-model="userStore.user.preferences.nickname.color"
        class="input input-bordered w-full px-1"
        type="color"
        name="nickname-color"
      />
    </article>
    <div class="">
      <fieldset class="rounded border-2 border-base-content p-2">
        <legend class="-ml-1 -translate-x-1 pl-2 text-xl font-bold">
          Show alert on:
        </legend>
        <article
          class="flex items-center justify-between rounded border-2 border-base-content px-2"
        >
          <label
            for="must-show-alert-pasta-copied"
            class="label cursor-pointer text-xl font-medium"
          >
            <h3>Pasta Copied</h3>
          </label>
          <input
            id="must-show-alert-pasta-copied"
            v-model="
              userStore.user.preferences.alerts.copypastaCopy.mustShowOnSuccess
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
