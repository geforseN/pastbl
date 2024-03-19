<template>
  <div class="flex items-center gap-1">
    <time :datetime="date.toISOString()">
      {{ $t("loaded") }} {{ timeAgo }}
    </time>
    <div
      ref="timeTooltipRef"
      class="tooltip tooltip-top tooltip-info box-content flex h-6 w-6 items-center justify-center rounded-full border bg-info focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-info"
      tabindex="0"
      :class="toValue(timeTooltip.focused) && 'tooltip-open'"
      :data-tip="date.toLocaleString()"
    >
      <icon size="16" name="carbon:data-enrichment" />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { date } = defineProps<{ date: Date }>();

const timeTooltipRef = ref<HTMLDivElement>();
const timeTooltip = useFocus(timeTooltipRef);

const timeAgo = useI18TimeAgo(date);
</script>
