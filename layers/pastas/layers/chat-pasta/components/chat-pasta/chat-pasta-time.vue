<template>
  <div class="dropdown dropdown-top dropdown-hover w-full">
    <div class="block w-full justify-between text-sm">
      <time
        :datetime="time.toISOString()"
        class="block"
      >
        {{ label }}
        {{ timeAgo }}
      </time>
      <span class="opacity-80">
        {{ time.toLocaleTimeString() }}
      </span>
    </div>
    <div
      class="card dropdown-content compact z-10 w-max rounded-box border bg-base-100 shadow"
    >
      <div class="card-body !px-3 !py-2 font-bold text-base-content">
        {{ time.toLocaleString() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useI18nTimeAgo } from "../../../../../../app/utils/i18n";

const props = defineProps<{
  value: Date | number | string;
  label: string;
}>();

const time = computed(() => new Date(props.value));

const label = computed(() => props.label);

const timeAgo = useI18nTimeAgo(time);
</script>
