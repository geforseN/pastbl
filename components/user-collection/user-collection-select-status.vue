<template>
  <button
    v-if="!props.isSelected"
    :class="[size.btn, props.isSelected && props.selectedClass]"
    class="btn btn-primary"
    @click="emit('select')"
  >
    {{ $t("collections.users.ready.button.select") }}
  </button>
  <div
    v-else
    ref="collectionActiveTooltipRef"
    :class="[
      size.btn,
      props.isSelected && props.selectedClass,
      toValue(collectionActiveTooltip.focused) && 'tooltip-open',
    ]"
    class="btn btn-success tooltip tooltip-top tooltip-success flex items-center gap-0.5 rounded-full font-bold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    tabindex="0"
    :data-tip="$t('collections.users.ready.selected-tooltip', { nickname })"
  >
    {{ $t("collections.users.ready.selected") }}
    <icon :size="size.icon" name="ic:outline-info" :class="size.iconClass" />
  </div>
</template>
<script lang="ts" setup>
import { buttonSizes } from "../emote-collection";

const collectionActiveTooltipRef = ref<HTMLDivElement>();
const collectionActiveTooltip = useFocus(collectionActiveTooltipRef);

const props = defineProps<{
  isSelected: boolean;
  nickname: string;
  selectedClass?: string;
  size: "xs" | "sm";
}>();

const emit = defineEmits<{
  select: [];
}>();

const size = computed(() => buttonSizes[props.size]);
</script>
