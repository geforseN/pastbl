<template>
  <div
    data-testid="chat-pasta"
    class="chat-pasta border-secondary flex"
    :class="compact ? 'flex-col' : 'flex-row'"
  >
    <chat-pasta-main-data
      :tags
      :text
      @populate-text="(container) => $emit('populate', container)"
    >
      <template #beforeColon>
        <slot name="creatorData" />
      </template>
      <template #bottom>
        <chat-pasta-time
          v-if="!compact"
          v-bind="time"
        />
      </template>
    </chat-pasta-main-data>
    <div
      v-if="compact"
      class="chat-pasta__mobile-bottom flex justify-between p-1"
      data-testid="chat-pasta__bottom-bar"
    >
      <chat-pasta-time v-bind="time" />
      <div
        class="chat-pasta__actions-for-mobile flex items-center justify-between gap-0.5"
      >
        <chat-pasta-more-actions
          @remove="emit('remove')"
          @edit="emit('edit')"
        />
        <chat-pasta-copy-button />
      </div>
    </div>
    <div
      v-else
      class="flex-col items-center justify-between gap-y-0.5 px-1 py-2"
      data-testid="chat-pasta__right-sidebar"
    >
      <chat-pasta-copy-button @click="emit('copy')" />
      <chat-pasta-more-actions
        @remove="emit('remove')"
        @edit="emit('edit')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const { compact, tags = [] } = defineProps<{
  text: string;
  tags?: string[];
  time: {
    label: string;
    value: string | number | Date;
  };
  compact?: boolean;
}>();

defineSlots<{
  creatorData: VueSlot;
}>();

const emit = defineEmits<{
  populate: [pastaTextContainer: HTMLElement];
  remove: [];
  copy: [];
  edit: [];
}>();
</script>
<style>
.chat-pasta-emote {
  display: inline;
  margin: -5px 0;
}

.chat-pasta-list > .vue-recycle-scroller__item-wrapper {
  @apply min-w-[342px];
}

.chat-pasta-list:not([data-compact]) {
  > .vue-recycle-scroller__item-wrapper {
    @apply sm:min-w-[420px];
  }

  .chat-pasta {
    & {
      @apply sm:flex-row;
    }

    .chat-pasta__main {
      @apply sm:p-2;
    }

    .chat-pasta__actions-for-pc {
      @apply sm:flex sm:px-0;
    }

    .chat-pasta__main-123 {
      @apply sm:border;
    }

    .chat-pasta__visible-on-pc {
      @apply sm:block;
    }

    .chat-pasta__mobile-bottom {
      @apply sm:hidden;
    }

    .chat-pasta__created {
      @apply sm:flex sm:text-base;
    }

    .chat-pasta__sidebar {
      @apply sm:h-8;
    }

    .chat-pasta__sidebar-copy-button {
      @apply sm:h-14 sm:w-14 sm:text-sm/none;
    }

    .chat-pasta__sidebar-more-actions-button {
      @apply sm:h-8 sm:!min-h-8 sm:w-12;

      .more-horiz-icon {
        @apply sm:block;
      }

      .more-vert-icon {
        @apply sm:hidden;
      }
    }

    .chat-pasta__sidebar-more-actions-list {
      @apply sm:translate-x-12;
    }
  }
}
</style>
