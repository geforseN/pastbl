<template>
  <button
    v-if="!props.isCollectionSelected"
    class="btn btn-primary btn-sm"
    @click="() => emit('select')"
  >
    Select as active
  </button>
  <div
    v-else
    ref="collectionActiveTooltipRef"
    class="badge badge-primary badge-lg tooltip tooltip-top tooltip-primary font-bold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    tabindex="0"
    :class="toValue(collectionActiveTooltip.focused) && 'tooltip-open'"
    :data-tip="`Emotes of ${props.nickname} used in your pastas`"
  >
    Selected as active
    <icon size="16" name="carbon:data-enrichment" class="mb-1" />
  </div>
</template>
<script lang="ts" setup>
const collectionActiveTooltipRef = ref<HTMLDivElement>();
const collectionActiveTooltip = useFocus(collectionActiveTooltipRef);

const props = defineProps<{
  isCollectionSelected: boolean;
  nickname: string;
}>();

const emit = defineEmits<{ select: [] }>();
</script>
