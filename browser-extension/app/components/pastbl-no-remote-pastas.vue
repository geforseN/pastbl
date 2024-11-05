<template>
  <div
    class="flex h-full flex-col items-center justify-end"
  >
    <p>{{ $t('noRemotePastasFound') }}</p>
    <a
      class="link"
      :href="config.pastbl.baseUrl"
    >
      {{ $t('createHere') }}
    </a>
  </div>
</template>
