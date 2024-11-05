<template>
  <span>
    {{ $t('youAreNotAuthorizedTo') }}
    <a
      class="link"
      :href="config.pastbl.baseUrl"
    >
      pastbl
    </a>
  </span>
</template>
