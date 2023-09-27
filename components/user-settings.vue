<template>
  <div class="p-2 border-2 border-base-content rounded">
    <h2 class="text-3xl font-bold mb-2">User settings</h2>
    <div>
      <div class="w-full max-w-xs flex items-center border-2 border-secondary rounded-md">
        <label class="label py-0">
          <span class="oneWordPerLine w-min">Badges count</span>
        </label>
        <input v-model="userStore.user.badges.count" min="0" max="10" type="number" name="" id="badges-count"
          class="input border-l-black w-24">
      </div>
      <div class="w-full max-w-xs flex items-center border-2 border-secondary rounded-md">
        <label class="label">
          <span class="label-text">Nickname</span>
        </label>
        <input name="" id="" placeholder="Your Nickname"
          class="placeholder:text-lg placeholder:text-neutral-50 input input-bordered bg-secondary"
          v-model="userStore.user.nickname" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>