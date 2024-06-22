<template>
  <!-- eslint-disable vue/no-v-html -->
  <button
    class="chat-pasta__sidebar-copy-button btn btn-square btn-accent border-2 border-accent-content text-xs/none"
    v-html="$t('pasta.copy')"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>
<style scoped>
.btn {
  word-break: break-word;
}
</style>
