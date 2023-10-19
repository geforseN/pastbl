<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change user settings</h2>
    <div class="grid grid-cols-1 divide-y divide-base-content">
      <div class="grid w-full grid-cols-1 p-2">
        <label class="label" for="badges-count">
          <span class="text-xl font-medium">Badges count</span>
        </label>
        <user-settings-badges-count
          v-model:badges-count.number="userStore.user.badges.count"
        />
      </div>
      <div class="grid w-full grid-cols-1 p-2">
        <label class="label" for="nickname">
          <span class="text-xl font-medium">Nickname</span>
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
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
