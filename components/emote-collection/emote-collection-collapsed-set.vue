<template>
  <div class="collapse collapse-arrow">
    <input
      v-model="isOpen"
      type="checkbox"
      @keypress.enter.exact="isOpen = !isOpen"
    />
    <header class="collapse-title">
      <slot name="title" />
    </header>
    <main class="collapse-content -mb-4 p-0">
      <!-- NOTE: div has v-if for lazy loading images, so user will start fetch images only when collapse component open    -->
      <!-- NOTE: v-show wont help with lazy loading, images will be loaded even if collapse is closed    -->
      <div v-if="isOpen">
        <slot name="emoteList" :is-open="isOpen" />
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup generic="EmoteSet">
const isOpen = ref(false);
defineProps<{ set: EmoteSet }>();
defineSlots<{
  title: () => any;
  emoteList: (listProps: { isOpen: boolean }) => any;
}>();
</script>
