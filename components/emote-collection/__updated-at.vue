<template>
  <div class="flex items-baseline justify-between gap-2">
    <div>
      <time :datetime="time.toISOString()">
        {{ $t("updated") }}
        {{ timeAgo }}
      </time>
      <div class="dropdown dropdown-end dropdown-hover ml-1">
        <div tabindex="0" role="button">
          <icon name="ic:outline-info" size="20" class="text-info" />
        </div>
        <div
          class="card dropdown-content compact z-[1] w-max rounded-box border bg-base-100 shadow"
        >
          <div class="card-body font-bold text-base-content">
            {{ $t("updated") }}
            {{ time.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  time: Date | number | string;
}>();

const time = computed(() => new Date(props.time));

const timeAgo = useI18TimeAgo(time);
</script>
