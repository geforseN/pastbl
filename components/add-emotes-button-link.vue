<template>
  <nuxt-link-locale
    to="/collections?focus=fetch#heading"
    class="btn btn-accent btn-sm items-center justify-start gap-1.5 text-nowrap p-2"
  >
    <icon name="carbon:link" size="16" />
    <i18n-t keypath="emotes.$add" tag="span">
      <template #emotes>
        <span class="lowercase">
          {{ $t("emotes.person") }}
        </span>
      </template>
    </i18n-t>
  </nuxt-link-locale>
</template>
