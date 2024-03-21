<template>
  <div
    :class="
      isRefreshing &&
      'animate-pulse bg-gradient-to-r from-base-300 to-twitch-accent'
    "
    class="grid grid-cols-[minmax(0,5fr),minmax(0,2fr)] gap-1 rounded-btn p-2"
  >
    <div class="space-y-0.5">
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
            class="avatar min-w-12 rounded-full bg-twitch-accent/20"
          />
        </nuxt-link-locale>
        <div>
          <p class="truncate text-xl font-bold" :title="nickname">
            {{ nickname }}
          </p>
          <emote-collection-user-select-status
            size="xs"
            class="w-fit"
            :is-selected="isSelected"
            :nickname="nickname"
            @select="emit('select')"
          />
        </div>
      </div>
      <emote-collection-updated-at class="w-fit" :time="updatedAt" />
    </div>
    <div class="space-y-0.5">
      <emote-collection-user-delete-button-dialog
        v-slot="{ revealDialog, isDialogRevealed }"
        class="right-0 top-6"
        @delete="emit('delete')"
      >
        <emote-collection-user-delete-button
          size="xs"
          :disabled="isDialogRevealed"
          class="w-full flex-nowrap justify-between"
          icon-class="translate-x-1"
          @click="revealDialog"
        />
      </emote-collection-user-delete-button-dialog>
      <nuxt-link-locale
        :to="`/collections/users/${login}`"
        class="btn btn-info link btn-xs w-full text-nowrap focus:outline-twitch-accent"
      >
        {{ $t("collections.users.ready.button.more") }}
      </nuxt-link-locale>
      <emote-collection-refresh-button
        size="xs"
        class="w-full flex-nowrap justify-between"
        icon-refreshing-class="absolute right-1 animate-spin rounded-full bg-inherit"
        :is-refreshing="isRefreshing"
        @click="emit('refresh')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
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
</script>
