<template>
  <button
    class="btn btn-square btn-accent border-2 border-accent-content text-xs/none sm:h-14 sm:w-14 sm:text-sm/none"
    :disabled="!$clipboard.isSupported"
    v-html="$t('pasta.dropdown.buttons.copy')"
  />
</template>
<style scoped>
.btn {
  word-break: break-word;
}
</style>
