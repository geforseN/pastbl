<template>
  <div
    class="dropdown w-fit space-x-0.5"
    :class="props.dropdownClass"
  >
    <time
      :datetime="time.toISOString()"
      class="w-full text-ellipsis text-nowrap"
    >
      {{ $t("updated") }}
      {{ timeAgo }}
    </time>
    <div
      tabindex="0"
      role="button"
      class="btn btn-circle btn-ghost btn-xs text-info"
    >
      <icon
        name="ic:outline-info"
        size="20"
      />
    </div>
    <div
      :class="props.dropdownContentClass"
      class="card dropdown-content compact rounded-box bg-base-100 z-10 w-max border shadow"
    >
      <div class="card-body text-base-content font-bold">
        {{ $t("updated") }}
        {{ time.toLocaleString() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    time: Date | number | string;
    dropdownClass?: string;
    dropdownContentClass?: string;
  }>(),
  {
    dropdownClass:
      "dropdown-end dropdown-bottom dropdown-hover  flex flex-nowrap",
    dropdownContentClass: "",
  },
);

const time = computed(() => new Date(props.time));

const timeAgo = useI18nTimeAgo(time);
</script>
