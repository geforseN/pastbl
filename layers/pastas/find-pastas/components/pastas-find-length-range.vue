<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h3 class="collapse-title text-xl font-bold">
      {{ $t("pasta.find.range.heading") }}
    </h3>
    <div class="collapse-content">
      <article class="mb-3 flex items-center justify-between">
        <label class="cursor-pointer" for="must-respect-selected-length">
          <h3>{{ $t("pasta.find.range.must-respect") }}</h3>
        </label>
        <input
          id="must-respect-selected-length"
          v-model="respect"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </article>
      <el-slider v-model="range" :disabled="!respect" range :min :max />
      <div class="flex justify-between">
        <div class="flex flex-col">
          <label
            for="pasta-to-find-min-length"
            :class="!respect && 'opacity-50'"
          >
            {{ $t("pasta.find.range.min") }}
          </label>
          <el-input-number
            v-model="range[0]"
            :min
            :max="range[1]"
            :disabled="!respect"
          />
        </div>
        <div class="flex flex-col">
          <label
            for="pasta-to-find-max-length"
            :class="!respect && 'opacity-50'"
          >
            {{ $t("pasta.find.range.max") }}
          </label>
          <el-input-number
            id="pasta-to-find-max-length"
            v-model="range[1]"
            :min="range[0]"
            :max="max"
            :disabled="!respect"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const range = defineModel<number[]>({ required: true });

const min = defineModel<number>("min", { required: true });
const max = defineModel<number>("max", { required: true });

const respect = defineModel<boolean>("respect", { required: true });
</script>
<style scoped>
:deep(.el-slider__bar) {
  background-color: theme(colors.secondary);
}

:deep(.el-slider__button) {
  border: 4px solid theme(colors.secondary);
}

:deep(.el-input) {
  --el-input-focus-border-color: theme(colors.secondary);
}

:deep(.el-input__wrapper:hover) {
  --el-input-hover-border-color: theme(colors.secondary);
}
:deep(.el-input__wrapper.is-focus) {
  --el-input-focus-border-color: theme(colors.secondary);
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: theme(colors.secondary);
}
</style>
