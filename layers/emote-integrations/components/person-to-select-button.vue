<template>
  <button
    class="btn btn-outline btn-sm hover:border-secondary my-0.5 justify-start p-0"
  >
    <div class="rounded-btn flex items-center gap-1 p-0.5">
      <twitch-user-avatar
        :twitch
        :size="24"
      />
      <span class="line-clamp-1 break-all">
        {{ twitch.nickname }}
      </span>
    </div>
  </button>
</template>
<script setup lang="ts">
defineProps<{
  twitch: PersonTwitch;
}>();
</script>
