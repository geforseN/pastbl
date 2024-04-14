<template>
  <div class="px-2">
    <p>
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
    </p>
    <p>
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
    </p>
  </div>
</template>
<script setup lang="ts">
const ae = "app.hint.add-emotes.";
</script>
