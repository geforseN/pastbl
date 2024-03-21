<template>
  <div>
    <time :datetime="time.toISOString()">
      {{ $t(messageKey) }}
      {{ timeAgo }}
    </time>
    <div class="dropdown" :class="props.dropdownClass">
      <div
        tabindex="0"
        role="button"
        class="btn btn-circle btn-ghost btn-xs translate-y-1 text-info"
      >
        <icon name="ic:outline-info" size="20" />
      </div>
      <div
        :class="props.dropdownContentClass"
        class="card dropdown-content compact z-[10] w-max rounded-box border bg-base-100 shadow"
      >
        <div class="card-body font-bold text-base-content">
          {{ $t(messageKey) }}
          {{ time.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    messageKey: string;
    date: Date | number | string;
    dropdownClass?: string;
    dropdownContentClass?: string;
  }>(),
  {
    dropdownClass: "dropdown-end dropdown-hover",
    dropdownContentClass: "",
  },
);

const time = computed(() => new Date(props.date));

const timeAgo = useI18nTimeAgo(time);
</script>
