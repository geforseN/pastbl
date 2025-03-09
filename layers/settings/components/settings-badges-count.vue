<template>
  <div class="join relative">
    <div class="join-item grow">
      <input
        id="badges-count"
        v-model.number="badgesCount"
        class="input input-secondary out-of-range:!bg-error/10 hover:bg-base-300 focus:bg-base-300 w-full rounded-r-none border-r-0 text-lg"
        min="0"
        max="10"
        type="number"
        inputmode="numeric"
        name="badges-count"
      />
      <label
        v-show="errorMessage"
        class="label"
        for="badges-count"
      >
        <span class="label-text text-error font-bold">{{ errorMessage }}</span>
      </label>
    </div>
    <button
      class="btn btn-square join-item border-secondary focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary border pb-1 text-2xl font-medium"
      @click="badgesCount--"
    >
      -
    </button>
    <button
      class="btn btn-square join-item border-secondary focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary border text-2xl font-medium"
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
<script setup lang="ts">
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
  if (value > appConfig.badges.count.max) {
    return t("settings.badges-count.input.toBig", appConfig.badges.count.max);
  }
  if (value < appConfig.badges.count.min) {
    return t("settings.badges-count.input.toSmall", appConfig.badges.count.min);
  }
  return "";
}
</script>
