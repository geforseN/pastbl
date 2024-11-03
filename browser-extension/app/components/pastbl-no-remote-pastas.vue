<template>
  <div
    class="flex h-full flex-col items-center justify-end"
  >
    <p>{{ i18n.t('noRemotePastasFound') }}</p>
    <a
      class="link"
      :href="config.pastbl.baseUrl"
    >
      {{ i18n.t('createHere') }}
    </a>
  </div>
</template>
