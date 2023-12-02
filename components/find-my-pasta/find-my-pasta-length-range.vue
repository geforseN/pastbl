<template>
  <section class="form-control rounded border p-2">
    <div class="flex items-center gap-6">
      <h3 class="whitespace-nowrap text-xl font-bold">Length</h3>
      <VaSlider
        v-model="range"
        range
        :min="minValue"
        :max="maxValue"
        color="secondary"
        class="w-full px-2 pt-2"
        track-label-visible
      >
        <template #trackLabel="{ value }">
          <span class="text-base-content">{{ value }}</span>
        </template>
      </VaSlider>
    </div>
    <div class="flex justify-between p-1">
      <div class="flex flex-col">
        <label for="pasta-to-find-min-length">min length</label>
        <VaCounter
          id="pasta-to-find-min-length"
          v-model="range[0]"
          :min="minValue"
          :max="range[1]"
          buttons
          :flat="false"
          margins="0"
          color="secondary"
          class="w-28"
        />
      </div>
      <div class="flex flex-col">
        <label for="pasta-to-find-max-length">max length</label>
        <VaCounter
          id="pasta-to-find-max-length"
          v-model="range[1]"
          :min="range[0]"
          :max="maxValue"
          buttons
          :flat="false"
          margins="0"
          color="secondary"
          class="w-28"
        />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const range = defineModel<number[]>({
  required: true,
});
const minValue = defineModel("minValue", { required: true, type: Number });
const maxValue = defineModel("maxValue", { required: true, type: Number });
</script>
<style scoped>
:deep(.va-slider__container)
  *:where(.va-slider__track--selected, .va-slider__handler) {
  background-color: theme(colors.secondary) !important;
  border-color: theme(colors.secondary) !important;
}
</style>
