<template>
  <div class="flex flex-col rounded-b-btn border-2 px-2">
    <span>
      {{ $t(ae + "global.before") }}
      <nuxt-link-locale
        :to="{
          path: '/collections/global',
          hash: '#heading',
        }"
        class="link lowercase"
      >
        {{ $t("collections.global.link") }}
      </nuxt-link-locale>
    </span>
    <span>
      {{ $t(ae + "user.before") }}
      <nuxt-link-locale
        :to="{
          path: '/collections',
          query: {
            'focus-fetch-input': 'true',
          },
          hash: '#heading',
        }"
        class="link lowercase"
      >
        {{ $t(ae + "user.link") }}
      </nuxt-link-locale>
    </span>
  </div>
</template>
<script setup lang="ts">
const ae = "app.hint.add-emotes.";
</script>
