<template>
  <div class="flex">
    <nuxt-link-locale
      target="_blank"
      :to
      class="rounded-full border border-twitch-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
    >
      <img
        class="rounded-full bg-twitch-accent/20"
        :width="size"
        :height="size"
        :src="twitch.avatarUrl"
        :alt="$t('avatar.alt', { nickname: twitch.nickname })"
      />
    </nuxt-link-locale>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  twitch: Pick<PersonTwitch, "avatarUrl" | "login" | "nickname">;
  size: number;
  to?: string;
}>();

const to = computed(
  () => props.to ?? `https://twitch.tv/${props.twitch.login}`,
);
</script>
