<template>
  <section class="p-2 border-2 border-base-content rounded">
    <h2 class="text-3xl font-bold mb-2 border-b p-2">User settings</h2>
    <div class="w-full flex flex-col gap-y-4">
      <div class="w-full grid grid-cols-[2fr,4fr] rounded-md pt-6 pb-2 px-2 border-y-2">
        <label class="label" for="badges-count">
          <span class="text-xl font-medium">Badges count</span>
        </label>
        <user-settings-badges-count v-model:badges-count.number="userStore.user.badges.count" />
      </div>
      <div class="w-full grid grid-cols-[2fr,4fr] rounded-md pt-6 pb-1 px-2 border-y-2">
        <label class="label" for="nickname">
          <span class="text-xl font-medium">Nickname</span>
        </label>
        <input name="nickname" id="nickname" placeholder="Your Nickname"
          class="placeholder:text-lg placeholder:text-base-content input input-bordered input-secondary"
          v-model="userStore.user.nickname" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
