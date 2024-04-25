<template>
  <nav class="navbar border-b-2 border-b-secondary/50 p-1">
    <ol class="contents space-x-2">
      <li
        class="border-2 border-neutral bg-secondary/95 p-1 text-5xl font-bold text-base-content bg-hero-graph-paper"
      >
        <nuxt-link-locale class="logo relative bottom-px text-5xl" to="/">
          pastbl
        </nuxt-link-locale>
      </li>
      <li class="hidden go-brr:block">
        <nuxt-link-locale
          class="btn btn-outline flex-nowrap text-wrap border-twitch-accent bg-base-100 text-twitch-accent"
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
      <li class="hidden go-brr:block">
        <nuxt-link-locale
          to="/user/settings#heading"
          class="btn btn-outline flex-nowrap bg-base-100"
        >
          <strong>{{ $t("user.settings.link") }}</strong>
          ⚙️
        </nuxt-link-locale>
      </li>
      <li class="!ml-auto"></li>
      <li class="relative hidden sm:block">
        <label
          for="select-locale"
          class="absolute -top-1.5 left-3 block bg-base-100 px-1 text-base/tight opacity-80"
        >
          {{ $t("language") }}
        </label>
        <select
          id="select-locale"
          class="select select-bordered select-sm xs:select-md"
          name="select-locale"
          @change="locales.change"
        >
          <option
            v-for="locale in locales.objects"
            :key="locale.code"
            :value="locale.code"
            :selected="locale.code === locales.selected"
          >
            {{ locale.name }}
          </option>
        </select>
      </li>
      <li class="relative">
        <label
          for="app-theme"
          class="absolute -top-1.5 left-3 block bg-base-100 px-1 text-base/tight opacity-80"
        >
          {{ $t("theme.label") }}
        </label>
        <select
          id="app-theme"
          v-model="themes.selected"
          class="select select-bordered select-sm xs:select-md"
          name="select-app-theme"
        >
          <option
            v-for="[theme, name] of themes.entries"
            :key="name"
            :value="theme"
          >
            {{ name }}
          </option>
        </select>
      </li>
      <li class="hidden bg-base-100 go-brr:block">
        <auth-logged-in-dropdown
          v-if="userSession.loggedIn && userSession.user"
          :login="userSession.user.twitch.login"
          :nickname="userSession.user.twitch.nickname"
          :profile-image-url="userSession.user.twitch.profileImageUrl"
          @logout="userSession.clear"
        />
        <auth-twitch-login-btnlink v-else />
      </li>
      <!-- <li class="bg-red-500">
        <client-only>
          <app-pastas-work-mode-toggle />
        </client-only>
      </li> -->
      <li>
        <app-drawer-burger-button class="go-brr:hidden" />
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
const themes = reactive(useThemes());

const locales = reactive(useLocales());

const userSession = reactive(useUserSession());
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
