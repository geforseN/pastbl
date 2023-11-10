<template>
  <div class="collapse collapse-arrow">
    <input
      v-model="isCollapseOpen"
      type="checkbox"
      @input="mustRenderContent = true"
      @keypress.enter.exact="
        mustRenderContent = true;
        isCollapseOpen = !isCollapseOpen;
      "
    />
    <header class="collapse-title">
      <slot name="title" />
    </header>
    <main class="collapse-content -mb-4 p-0">
      <slot v-if="mustRenderContent" name="emoteList" />
    </main>
  </div>
</template>
<script lang="ts" setup generic="EmoteSet">
const isCollapseOpen = ref(false);
const mustRenderContent = ref(false);

defineProps<{ set: EmoteSet }>();
defineSlots<{
  title: () => unknown;
  emoteList: () => unknown;
}>();
</script>
