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
          class="btn btn-outline flex-nowrap text-wrap border-twitch-accent text-twitch-accent"
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
      <li class="absolute right-[6rem] top-2 sm:static">
        <div
          v-if="userSession.loggedIn && userSession.user"
          class="flex h-12 items-center space-x-2 divide-x rounded-btn border p-2"
        >
          <div class="flex h-6 items-center gap-1">
            <img
              width="24"
              height="24"
              class="min-h-6 min-w-6 rounded-full"
              :src="userSession.user.twitch.profileImageUrl"
              :alt="`${userSession.user.twitch.nickname} avatar`"
            />
            {{ userSession.user.twitch.nickname }}
          </div>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button">
              <icon name="ic:arrow-drop-down" class="min-w-6" size="24" />
            </div>
            <div
              tabindex="0"
              class="menu dropdown-content z-[1] w-max rounded-box bg-base-100 p-2 shadow"
            >
              <button class="btn btn-outline" @click="userSession.clear">
                <span
                  class="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2"
                >
                  {{ $t("account.logout") }}
                </span>
              </button>
            </div>
          </div>
        </div>
        <a
          v-else
          href="/api/auth/twitch"
          class="group btn btn-ghost flex-nowrap bg-twitch-accent text-base-300"
        >
          <span
            class="text-lg/1 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2"
          >
            {{ t("account.loginWithTwitch") }}
          </span>
          <emote-integration-logo
            source="Twitch"
            class="h-6 w-6 translate-y-0.5"
          />
        </a>
      </li>
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

const userSession = reactive(useUserSession());

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
