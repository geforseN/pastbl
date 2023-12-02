<template>
  <section class="flex flex-col">
    <div class="flex flex-col justify-between">
      <h2>Pasta Length</h2>
      <div>
        <VaSlider
          v-model="range"
          range
          :min="minValue"
          :max="maxValue"
          color="secondary"
          track-label-visible
        >
          <template #trackLabel="{ value }">
            <span class="text-base-content">{{ value }}</span>
          </template>
        </VaSlider>
      </div>
      <div class="flex justify-evenly">
        <div class="flex flex-col">
          <label for="pasta-to-find-min-length">min</label>
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
          <label for="pasta-to-find-max-length">max</label>
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
