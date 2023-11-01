<template>
  <div class="collapse collapse-arrow">
    <input
      v-model="isOpen"
      type="checkbox"
      @input="shouldShowContent = true"
      @keypress.enter.exact="
        shouldShowContent = true;
        isOpen = !isOpen;
      "
    />
    <header class="collapse-title">
      <slot name="title" />
    </header>
    <main class="collapse-content -mb-4 p-0">
      <slot v-if="shouldShowContent" name="emoteList" />
    </main>
  </div>
</template>
<script lang="ts" setup generic="EmoteSet">
const isOpen = ref(false);
const shouldShowContent = ref(false);

defineProps<{ set: EmoteSet }>();
defineSlots<{
  title: () => any;
  emoteList: () => any;
}>();
</script>
