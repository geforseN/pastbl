<template>
  <div class="px-2">
    <i18n-t
      keypath="emotes.$add"
      tag="p"
    >
      <template #emotes>
        <nuxt-link-locale
          to="/collections?focus=fetch#heading"
          class="link lowercase"
        >
          {{ $t("emotes.person") }}
        </nuxt-link-locale>
      </template>
    </i18n-t>
  </div>
</template>
