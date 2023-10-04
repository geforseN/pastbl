<template>
  <section class="rounded border-2 border-base-content p-2">
    <h2 class="mb-2 border-b p-2 text-3xl font-bold">User settings</h2>
    <div class="flex w-full flex-col gap-y-4">
      <div
        class="grid w-full grid-cols-[2fr,4fr] rounded-md border-y-2 px-2 pb-2 pt-6"
      >
        <label class="label" for="badges-count">
          <span class="text-xl font-medium">Badges count</span>
        </label>
        <user-settings-badges-count
          v-model:badges-count.number="userStore.user.badges.count"
        />
      </div>
      <div
        class="grid w-full grid-cols-[2fr,4fr] rounded-md border-y-2 px-2 pb-1 pt-6"
      >
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
