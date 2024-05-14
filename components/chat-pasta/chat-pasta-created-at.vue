<template>
  <div class="dropdown dropdown-top dropdown-hover w-full">
    <time
      class="block w-full justify-between text-sm sm:flex sm:text-base"
      :datetime="time.toISOString()"
    >
      <div>
        {{ $t("pasta._created") }}
        {{ timeAgo }}
      </div>
      <span class="opacity-80">
        {{ time.toLocaleTimeString() }}
      </span>
    </time>
    <div
      class="card dropdown-content compact z-[10] w-max rounded-box border bg-base-100 shadow"
    >
      <div class="card-body !px-3 !py-2 font-bold text-base-content">
        {{ $t("pasta._created") }}
        {{ time.toLocaleString() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  date: Date | number | string;
}>();

const time = computed(() => new Date(props.date));

const timeAgo = useI18nTimeAgo(time);
</script>
