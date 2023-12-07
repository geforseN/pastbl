<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h3 class="collapse-title text-xl font-bold">Length range</h3>
    <div class="collapse-content">
      <article class="mb-3 flex items-center justify-between">
        <label class="cursor-pointer" for="must-respect-selected-length">
          <h3>Take into account selected length</h3>
        </label>
        <input
          id="must-respect-selected-length"
          v-model="respect"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </article>
      <div class="flex items-center gap-6">
        <VaSlider
          v-model="range"
          range
          :disabled="!respect"
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
          <label
            for="pasta-to-find-min-length"
            :class="!respect && 'opacity-50'"
          >
            min length
          </label>
          <VaCounter
            id="pasta-to-find-min-length"
            v-model="range[0]"
            :disabled="!respect"
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
          <label
            for="pasta-to-find-max-length"
            :class="!respect && 'opacity-50'"
          >
            max length
          </label>
          <VaCounter
            id="pasta-to-find-max-length"
            v-model="range[1]"
            :disabled="!respect"
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
const respect = defineModel("respect", { required: true, type: Boolean });
</script>
<style scoped>
:deep(.va-slider__container)
  *:where(.va-slider__track--selected, .va-slider__handler) {
  background-color: theme(colors.secondary) !important;
  border-color: theme(colors.secondary) !important;
}
</style>
