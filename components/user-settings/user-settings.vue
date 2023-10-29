<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change user settings</h2>
    <div class="grid grid-cols-1 divide-y">
      <article class="form-control p-2">
        <label class="label text-xl font-medium" for="badges-count">
          <h3>Badges count</h3>
        </label>
        <user-settings-badges-count
          v-model:badges-count.number="userStore.user.badges.count"
        />
      </article>
      <article class="form-control p-2">
        <label class="label text-xl font-medium" for="nickname">
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
      <label class="label text-xl font-medium" for="nickname-color">
        <h3>Nickname Color</h3>
      </label>
      <input
        id="nickname-color"
        v-model="userStore.user.preferences.nickname.color"
        class="h-10 w-full"
        type="color"
        name="nickname-color"
      />
    </article>
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
