<template>
  <with-dropdown
    side="right"
    data-testid="chat-pasta-time"
    :class="twMerge('text-sm', $attrs.class as string | undefined)"
  >
    <div class="justify-between">
      <time
        :datetime="time.toISOString()"
        class="block"
      >
        {{ label }}
      </time>
      <span class="opacity-80">
        {{ time.toLocaleTimeString() }}
      </span>
    </div>
    <template #content>
      <div
        class="card dropdown-content z-10 w-max border border-base-content bg-base-100 text-base-content"
      >
        <div class="card-body !px-3 !py-2 font-bold">
          {{ time.toLocaleString() }}
        </div>
      </div>
    </template>
  </with-dropdown>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { twMerge } from "tailwind-merge";
import WithDropdown from "../../with-dropdown/with-dropdown.vue";

interface ChatPastaTimeProps {
  value: Date | number | string;
  label: string;
}

const {
  label,
  value,
} = defineProps<ChatPastaTimeProps>();

const time = computed(() => new Date(value));
</script>
