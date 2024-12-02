<template>
  <div
    class="join flex rounded-lg"
  >
    <span
      class="join-item rounded-lg py-0.5 pl-1.5 pr-1 text-sm"
      :class="
        tag.startsWith('@')
          ? 'bg-twitch-accent text-twitch-base'
          : 'bg-info text-info-content'
      "
    >
      {{ tag }}
    </span>
    <button
      v-bind="closeButtonAttrs"
      class="btn btn-outline join-item btn-xs h-full border-l-0 text-sm"
      @click.prevent="$emit('remove')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
      >
        <!-- eslint-disable @stylistic/max-len -->
        <path
          fill="currentColor"
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
        />
      <!-- eslint-enable @stylistic/max-len -->
      </svg>
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  tag: string;
  closeButtonAttrs?: Record<string, unknown>;
}>();

defineEmits<{
  remove: [];
}>();
</script>
