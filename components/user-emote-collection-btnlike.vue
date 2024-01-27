<template>
  <div class="flex gap-2">
    <div class="flex h-8 w-8 items-center">
      <nuxt-link
        :to="`https://twitch.tv/${login}`"
        class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="nickname + ' avatar'"
          width="32"
          height="32"
          class="rounded-full bg-twitch/20"
        />
      </nuxt-link>
    </div>
    <span
      class="flex w-28 items-center truncate text-lg font-bold"
      :title="nickname"
    >
      {{ nickname }}
    </span>
    <div class="ml-auto flex items-center gap-1">
      <template v-if="mustShowButtons">
        <button class="btn btn-success btn-xs" @click="emit('refresh')">
          <icon name="ic:round-refresh" />
        </button>
        <button class="btn btn-error btn-xs" @click="emit('delete')">
          <icon name="ic:round-delete-outline" />
        </button>
      </template>
      <nuxt-link
        :to="`/collections/users/${login}`"
        class="btn btn-info link btn-xs focus:outline-twitch"
      >
        Show more
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  avatarUrl,
  nickname,
  mustShowButtons = true,
} = defineProps<{
  nickname: string;
  avatarUrl?: string;
  mustShowButtons?: boolean;
}>();

const login = computed(() => nickname.toLowerCase());

const emit = defineEmits<{
  refresh: [];
  delete: [];
}>();
</script>
