<template>
  <div
    :class="
      isRefreshing &&
      'animate-pulse bg-gradient-to-r from-base-300 to-twitch-accent'
    "
    class="space-y-0.5 rounded-btn p-2"
  >
    <div class="flex items-end gap-1">
      <nuxt-link-locale
        :to="`https://twitch.tv/${login}`"
        class="rounded-full border border-twitch-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
      >
        <img
          :src="avatarUrl"
          :alt="$t('avatar.alt', { nickname })"
          width="48"
          height="48"
          class="min-h-12 min-w-12 rounded-full bg-twitch-accent/20"
        />
      </nuxt-link-locale>
      <span class="flex flex-col truncate">
        <span class="text-xl font-bold" :title="nickname">{{ nickname }}</span>
        <use-time-ago :time="date" #="{ timeAgo }">
          <!-- FIXME: i18n time -->
          <time :datetime="date.toISOString()"> Updated {{ timeAgo }} </time>
        </use-time-ago>
      </span>
      <div class="ml-auto flex flex-col gap-0.5">
        <nuxt-link-locale
          :to="`/collections/users/${login}`"
          class="btn btn-info link btn-xs ml-auto w-24 text-nowrap focus:outline-twitch-accent"
        >
          {{ $t("collections.users.ready.button.more") }}
        </nuxt-link-locale>
        <button
          class="btn btn-success btn-xs w-24 flex-nowrap gap-0"
          :disabled="isRefreshing"
          @click="emit('refresh')"
        >
          {{ $t("collections.users.ready.button.refresh") }}
          <span v-if="isRefreshing" class="loading loading-spinner" />
          <icon v-else name="ic:round-refresh" />
        </button>
      </div>
    </div>
    <div class="flex justify-between">
      <user-collection-ready-status
        button-class="btn btn-primary btn-xs"
        :is-collection-selected="isSelected"
        :nickname="nickname"
        @select="emit('select')"
      />
      <user-collection-ready-delete-button
        button-class="btn btn-error btn-xs w-24"
        card-class="card card-compact absolute top-0 right-0 z-[1] w-64 border-2 bg-base-100 p-2 text-base-content"
        :nickname="nickname"
        @delete="emit('delete')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";
const { updatedAt, nickname, login, avatarUrl, isSelected, isRefreshing } =
  defineProps<{
    updatedAt: number;
    nickname: string;
    login: Lowercase<string>;
    avatarUrl: string;
    isSelected: boolean;
    isRefreshing: boolean;
  }>();

const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
}>();
const date = computed(() => new Date(updatedAt));
</script>
