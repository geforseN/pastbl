<template>
  <button
    v-if="!props.isCollectionSelected"
    :class="buttonClass"
    @click="() => emit('select')"
  >
    {{ $t("collections.users.ready.button.select") }}
  </button>
  <div
    v-else
    ref="collectionActiveTooltipRef"
    class="badge badge-primary badge-lg tooltip tooltip-top tooltip-primary font-bold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    tabindex="0"
    :class="toValue(collectionActiveTooltip.focused) && 'tooltip-open'"
    :data-tip="$t('collections.users.ready.selected-tooltip', { nickname })"
  >
    {{ $t("collections.users.ready.selected") }}
    <icon size="16" name="carbon:data-enrichment" class="mb-1" />
  </div>
</template>
<script lang="ts" setup>
const collectionActiveTooltipRef = ref<HTMLDivElement>();
const collectionActiveTooltip = useFocus(collectionActiveTooltipRef);

const props = withDefaults(
  defineProps<{
    isCollectionSelected: boolean;
    nickname: string;
    buttonClass?: string;
  }>(),
  {
    buttonClass: "btn btn-primary btn-sm",
  },
);

const emit = defineEmits<{ select: [] }>();
</script>
