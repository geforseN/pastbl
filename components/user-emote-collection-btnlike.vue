<template>
  <div class="flex gap-2">
    <div
      class="h-8 w-8 rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
    >
      <nuxt-link
        v-if="props.avatarUrl"
        :to="`https://twitch.tv/${props.nickname.toLowerCase()}`"
      >
        <img
          :src="props.avatarUrl"
          :alt="props.nickname + ' avatar'"
          width="32"
          height="32"
          class="rounded-full bg-twitch/20"
        />
      </nuxt-link>
    </div>
    <span class="text-2xl font-bold">{{ props.nickname }}</span>
    <div class="ml-auto flex items-center gap-1">
      <button class="btn btn-success btn-xs" @click="emit('refresh')">
        <icon name="ic:round-refresh" />
      </button>
      <button class="btn btn-error btn-xs" @click="emit('delete')">
        <icon name="ic:round-delete-outline" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  nickname: string;
  avatarUrl?: string;
}>();

const emit = defineEmits<{
  refresh: [];
  delete: [];
}>();
</script>
