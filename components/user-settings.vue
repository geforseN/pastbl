<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">User settings</h2>
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
          class="input input-bordered input-secondary text-lg placeholder:text-lg placeholder:text-base-content"
          id="nickname"
          v-model="userStore.user.nickname"
          spellcheck="false"
          name="nickname"
          placeholder="Your Nickname"
        />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
