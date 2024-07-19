<template>
  <div class="join relative">
    <div class="join-item grow">
      <input
        id="badges-count"
        v-model.number="badgesCount"
        class="input input-secondary w-full rounded-r-none border-r-0 text-lg out-of-range:!bg-error/10 hover:bg-base-300 focus:bg-base-300"
        min="0"
        max="10"
        type="number"
        inputmode="numeric"
        name="badges-count"
      />
      <label v-show="errorMessage" class="label" for="badges-count">
        <span class="label-text font-bold text-error">{{ errorMessage }}</span>
      </label>
    </div>
    <button
      class="btn btn-square join-item border border-secondary pb-1 text-2xl font-medium focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary"
      @click="badgesCount--"
    >
      -
    </button>
    <button
      class="btn btn-square join-item border border-secondary text-2xl font-medium focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary"
      @click="badgesCount++"
    >
      +
    </button>
  </div>
</template>
<!-- 
 TODO: use ValidityState
 LINK: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 -->
<script lang="ts" setup>
const appConfig = useAppConfig();

const badgesCount = defineModel<number>({
  required: true,
  set(value) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return badgesCount.value;
    }
    const nextErrorMessage = getNextErrorMessage(value);
    errorMessage.value = nextErrorMessage;
    if (nextErrorMessage) {
      return badgesCount.value;
    }
    return value;
  },
});

const errorMessage = ref("");

const { t } = useI18n();

function getNextErrorMessage(value: number) {
  if (value > appConfig.badgesCount.max) {
    return t("settings.badges-count.input.toBig", appConfig.badgesCount.max);
  }
  if (value < appConfig.badgesCount.min) {
    return t("settings.badges-count.input.toSmall", appConfig.badgesCount.min);
  }
  return "";
}
</script>
