<template>
  <nav class="navbar border-b-2 border-b-secondary/50 p-1">
    <ol class="contents space-x-2">
      <li
        class="border-2 border-neutral bg-secondary/95 p-1 text-5xl font-bold text-base-content"
      >
        <nuxt-link-locale class="logo relative bottom-[1px] text-5xl" to="/">
          pastbl
        </nuxt-link-locale>
      </li>
      <li class="hidden go-brr:block">
        <nuxt-link-locale
          class="btn btn-outline flex-nowrap text-wrap border-twitch text-twitch"
          to="/collections"
        >
          <strong>{{ $t("collections.index.link") }}</strong>
          <emote-integration-logos class="min-w-8" />
        </nuxt-link-locale>
      </li>
      <li class="hidden go-brr:block">
        <nuxt-link-locale class="btn btn-info flex-nowrap" to="/pastas/find">
          <strong>{{ $t("pasta.find.link") }}</strong>
          🔍
        </nuxt-link-locale>
      </li>
      <li>
        <nuxt-link-locale
          to="/user/settings#heading"
          class="btn btn-outline flex-nowrap"
        >
          <strong>{{ $t("user.settings.link") }}</strong>
          ⚙️
        </nuxt-link-locale>
      </li>
      <li class="xs:!ml-auto" />
      <li>
        <select
          id="select-locale"
          class="select select-bordered select-xs absolute right-2 top-1 w-20 sm:select-md sm:static sm:w-max"
          name="select-locale"
          @change="changeLocale"
        >
          <option
            v-for="availableLocale in locales"
            :key="availableLocale.code"
            :value="availableLocale.code"
            :selected="availableLocale.code === locale"
          >
            {{ availableLocale.name }}
          </option>
        </select>
      </li>
      <li>
        <select
          id="app-theme"
          v-model="selectedTheme.state.value"
          class="select select-bordered select-xs absolute right-2 top-8 w-20 sm:select-md sm:static sm:w-max"
          name="select-app-theme"
        >
          <option
            v-for="[theme, translatedText] in Object.entries(themes)"
            :key="translatedText"
            :value="theme"
          >
            {{ translatedText }}
          </option>
        </select>
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();

const selectedTheme = useIndexedDBKeyValue("app:daisyui-theme", "dark");

const themes = computedWithControl(locale, () => ({
  dark: t("theme.dark"),
  light: t("theme.light"),
}));

async function changeLocale(event: Event) {
  assert.ok(event instanceof Event && event.target);
  const { value } = event.target as unknown as { value: string };
  assert.ok(typeof value === "string");
  await setLocale(value);
}

onMounted(() => {
  watch(
    selectedTheme.state,
    () => {
      document.documentElement.dataset.theme = selectedTheme.state.value;
    },
    { immediate: true },
  );
});
</script>
<style scoped>
strong {
  font-weight: inherit;
}

.router-link-active strong {
  @apply underline decoration-2 underline-offset-2;
}

.logo {
  -webkit-text-stroke: 2px theme(colors.base-100);
}
</style>
