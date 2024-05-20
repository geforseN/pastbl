<template>
  <nuxt-link-locale
    to="/collections?focus=fetch#heading"
    class="btn btn-accent btn-sm items-center gap-1.5 bg-base-200 text-base-content"
  >
    {{ $t("emotes.add") }}
    <icon name="carbon:link" size="16" class="min-h-4 min-w-4" />
  </nuxt-link-locale>
</template>
