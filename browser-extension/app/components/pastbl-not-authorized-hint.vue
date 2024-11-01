<template>
  <span class="text-lg">
    {{ i18n.t('youAreNotAuthorizedTo') }}
    <a
      class="link"
      :href="config.pastbl.baseUrl"
    >
      pastbl
    </a>
  </span>
</template>
