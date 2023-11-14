<template>
  <section class="flex items-baseline justify-between px-1 py-2">
    <h2 class="text-2xl">Pasta Length</h2>
    <div class="flex gap-8">
      <div class="flex items-baseline gap-1">
        <label for="min">from</label>
        <input
          id="min"
          v-model="min"
          class="input input-secondary input-sm w-20"
          type="number"
          name="min"
          :min="props.minValue"
          :max="max"
        />
      </div>
      <div class="flex items-baseline gap-1">
        <label for="max">to</label>
        <input
          id="max"
          v-model="max"
          class="input input-secondary input-sm w-20"
          type="number"
          name="max"
          :min="min"
          :max="props.maxValue"
        />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const min = defineModel("min", { required: true, type: Number });
const max = defineModel("max", { required: true, type: Number });

const props = defineProps<{
  minValue: number;
  maxValue: number;
}>();
</script>
