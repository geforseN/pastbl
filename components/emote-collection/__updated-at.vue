<template>
  <div class="flex items-baseline justify-between gap-2">
    <div>
      <use-time-ago :time="date" #="{ timeAgo }">
        <time :datetime="date.toISOString()"> Updated {{ timeAgo }} </time>
      </use-time-ago>
      <div class="dropdown dropdown-end dropdown-hover ml-1">
        <div tabindex="0" role="button">
          <icon name="ic:outline-info" size="20" class="text-info" />
        </div>
        <div
          class="card dropdown-content compact z-[1] w-max rounded-box border bg-base-100 shadow"
        >
          <div class="card-body font-bold">
            Updated at
            {{ date.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-success btn-xs w-min" @click="emit('refresh')">
      Refresh
    </button>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const { updatedAt } = defineProps<{
  updatedAt: number;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const date = computed(() => new Date(updatedAt));
</script>
