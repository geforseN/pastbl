<template>
  <div class="flex flex-wrap items-center rounded-b-btn border-2 px-2">
    Showing pastas with&nbsp;
    <div class="my-0.5 flex rounded-btn border border-twitch p-0.5">
      <div class="flex h-6 w-6 items-center">
        <nuxt-link
          :to="`/collections/users/${login}`"
          class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="nickname + ' avatar'"
            width="24"
            height="24"
            class="rounded-full bg-twitch/20"
          />
        </nuxt-link>
      </div>
      <nuxt-link :to="`/collections/users/${login}`" class="link font-bold">
        {{ nickname.repeat(1).substring(0, 20) }}
      </nuxt-link>
    </div>
    &nbsp;emotes
  </div>
</template>
<script setup lang="ts">
import type { IUserEmoteCollection } from "~/integrations";

const props = defineProps<{
  collection: IUserEmoteCollection;
}>();
const nickname = computed(() => props.collection.user.twitch.nickname);
const login = computed(() => props.collection.user.twitch.login);

const avatarUrl = computed(() => props.collection.user.twitch.avatarUrl);
</script>
