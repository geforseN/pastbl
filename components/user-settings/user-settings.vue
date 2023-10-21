<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change user settings</h2>
    <div class="grid grid-cols-1 divide-y">
      <div class="form-control p-2">
        <label class="label text-xl font-medium" for="badges-count">
          Badges count
        </label>
        <user-settings-badges-count
          v-model:badges-count.number="userStore.user.badges.count"
        />
      </div>
      <div class="form-control p-2">
        <label class="label text-xl font-medium" for="nickname">
          Nickname
        </label>
        <input
          class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
          id="nickname"
          v-model="userStore.user.nickname"
          spellcheck="false"
          name="nickname"
          placeholder="e.g. Kappa"
        />
      </div>
    </div>
    <div class="form-control p-2">
      <label class="label text-xl font-medium" for="nickname-color"
        >Nickname Color</label
      >
      <input
        class="h-10 w-full"
        id="nickname-color"
        v-model="userStore.user.preferences.nickname.color"
        type="color"
        name="nickname-color"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
