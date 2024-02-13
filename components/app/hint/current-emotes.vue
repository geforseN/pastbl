<template>
  <div
    class="flex w-[420px] flex-wrap items-center rounded-b-btn border-2 px-2"
  >
    {{ $t(ce + "user.before") }}&nbsp;
    <div class="my-0.5 flex gap-1 rounded-btn border border-twitch p-0.5">
      <div class="flex h-6 w-6 items-center">
        <nuxt-link-locale
          :to="`/collections/users/${login}`"
          class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="$t('avatar.alt', { nickname })"
            width="24"
            height="24"
            class="min-w-6 rounded-full bg-twitch/20"
          />
        </nuxt-link-locale>
      </div>
      <nuxt-link-locale
        :to="`/collections/users/${login}`"
        class="link line-clamp-1 break-all font-bold"
      >
        {{ nickname }}
      </nuxt-link-locale>
    </div>
    &nbsp;{{ $t(ce + "user.after") }}
  </div>
</template>
<script setup lang="ts">
import type { IUserEmoteCollection } from "~/integrations";

const ce = "app.hint.current-emotes." as const;

const props = defineProps<{
  collection: IUserEmoteCollection;
}>();
const nickname = computed(() => props.collection.user.twitch.nickname);
const login = computed(() => props.collection.user.twitch.login);

const avatarUrl = computed(() => props.collection.user.twitch.avatarUrl);
</script>
