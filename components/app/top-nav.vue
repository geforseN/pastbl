<template>
  <nav class="navbar border-b-2 border-b-secondary/50 p-1">
    <ol class="contents">
      <li
        class="border-2 border-neutral bg-secondary/95 p-1 text-5xl font-bold text-base-content"
      >
        <nuxt-link-locale class="logo relative bottom-[1px] text-5xl" to="/">
          pastbl
        </nuxt-link-locale>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <nuxt-link-locale
          class="btn btn-outline flex-nowrap text-wrap border-twitch text-lg text-twitch"
          to="/collections"
        >
          {{ $t("collections.index.link") }}
          <emote-integration-logos class="min-w-8" />
        </nuxt-link-locale>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <nuxt-link-locale
          class="btn btn-info flex-nowrap text-lg"
          to="/pastas/find"
        >
          {{ $t("pasta.find.link") }}
          <span>🔍</span>
        </nuxt-link-locale>
      </li>
      <li class="ml-2">
        <nuxt-link-locale
          to="/user/settings#heading"
          class="btn btn-neutral btn-sm flex-nowrap sm:btn-md sm:text-lg"
        >
          {{ $t("user.settings.link") }}
          <span>⚙️</span>
        </nuxt-link-locale>
      </li>
      <dev-only>
        <li class="ml-auto xs:mr-2">
          <select
            id="select-locale"
            class="select select-bordered select-xs absolute right-2 top-1 w-20 sm:select-md sm:static sm:w-max"
            name="select-locale"
            :value="locale"
            @change="
              async ({ target }) => {
                assert.ok(target);
                const { value } = target;
                assert.ok(value);
                await setLocale(value);
              }
            "
          >
            <option
              v-for="availableLocale in locales"
              :key="availableLocale.code"
              :value="availableLocale.code"
            >
              {{ availableLocale.name }}
            </option>
          </select>
        </li>
      </dev-only>
      <li>
        <select
          id="app-theme"
          class="select select-bordered select-xs absolute right-2 top-8 w-20 sm:select-md sm:static sm:w-max"
          data-choose-theme
          name="select-app-theme"
        >
          <option
            v-for="[value, translated] in Object.entries(themes)"
            v-once
            :key="value"
            :value="value"
          >
            {{ translated }}
          </option>
        </select>
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();

const themes = {
  "": t("theme.default"),
  dark: t("theme.dark"),
  light: t("theme.light"),
};
</script>
<style scoped>
.logo {
  -webkit-text-stroke: 2px theme(colors.base-100);
}
</style>
