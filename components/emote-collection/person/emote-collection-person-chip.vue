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
        <twitch-user-avatar :user="{ avatarUrl, login, nickname }" :size="48" />
        <div>
          <p class="truncate text-xl font-bold" :title="nickname">
            {{ nickname }}
          </p>
          <emote-collection-person-select-button
            size="xs"
            class="w-fit"
            :is-collection-selected="isSelected"
            @click="isSelected ? emit('unselect') : emit('select')"
          />
        </div>
      </div>
      <emote-collection-formed-at class="w-fit" :time="formedAt" />
    </div>
    <div class="space-y-0.5">
      <emote-collection-person-delete-button-dialog
        v-slot="dialog"
        class="right-0 top-6"
        @delete="emit('delete')"
      >
        <emote-collection-person-delete-button
          size="xs"
          :disabled="dialog.isRevealed"
          class="w-full flex-nowrap justify-between"
          icon-class="translate-x-1"
          @click="dialog.reveal"
        />
      </emote-collection-person-delete-button-dialog>
      <emote-collection-person-link
        :login
        class="btn btn-info link btn-xs w-full text-nowrap focus:outline-twitch-accent"
      >
        {{ $t("show-more") }}
      </emote-collection-person-link>
      <refresh-button
        size="xs"
        class="w-full flex-nowrap justify-between"
        in-process-icon-class="absolute right-1 animate-spin rounded-full bg-inherit"
        :is-in-process="isRefreshing"
        @click="emit('refresh')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  formedAt: number;
  nickname: string;
  login: TwitchUserLogin;
  avatarUrl: string;
  isSelected: boolean;
  isRefreshing: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
  unselect: [];
}>();
</script>
