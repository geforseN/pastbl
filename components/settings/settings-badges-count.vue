<template>
  <div class="join relative">
    <div class="join-item grow">
      <input
        id="badges-count"
        class="input input-secondary w-full rounded-r-none border-r-0 text-lg out-of-range:!bg-error/10 hover:bg-base-300 focus:bg-base-300"
        v-model.number="model"
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
      @click="model = model - 1"
    >
      -
    </button>
    <button
      class="btn btn-square join-item border border-secondary text-2xl font-medium focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary"
      @click="model = model + 1"
    >
      +
    </button>
  </div>
</template>
<script lang="ts">
import { badgesCount } from "~/config/const";
</script>
<script lang="ts" setup>
const model = defineModel<number>({
  required: true,
  set(value) {
    if (typeof value === "string") {
      return model.value;
    }
    const nextErrorMessage = getNextErrorMessage(value);
    console.log({ value, nextErrorMessage });
    errorMessage.value = nextErrorMessage;
    if (nextErrorMessage) {
      return model.value;
    }
    return value;
  },
});

const errorMessage = ref("");
const { t } = useI18n();

// TODO: use ValidityState
// LINK: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
function handleInputChange(event: Event) {
  const value = parseEventTargetIntegerValue(event);
  if (value > 10) {
    return (errorMessage.value = "The badges count can not be more than 10");
  }
  if (value < 0) {
    return (errorMessage.value = "The badges count can not be negative number");
  }
  if (errorMessage.value) {
    errorMessage.value = "";
  }
  model.value = value;
}

function parseEventTargetIntegerValue(event: Event) {
  assert.ok(isObject(event.target), new TypeError("No event target provided"));
  assert.ok(
    typeof event.target.value === "string",
    new TypeError("Event target value must be a string"),
  );
  const value = Number(event.target.value);
  assert.ok(
    Number.isInteger(value),
    new TypeError("Event target value is not a integer"),
  );
  return value;
}

function getNextErrorMessage(value: number) {
  if (value > badgesCount.max) {
    return t("settings.badges-count.input.toBig", badgesCount.max);
  }
  if (value < badgesCount.min) {
    return t("settings.badges-count.input.toSmall", badgesCount.min);
  }
  return "";
}

function tryIncrementBadgesCount() {
  if (model.value === badgesCount.max) {
    errorMessage.value = "The badges count can not be more than 10";
    return;
  }
  model.value++;
}

function tryDecrementBadgesCount() {
  if (model.value <= badgesCount.min) {
    errorMessage.value = "The badges count can not be negative number";
    return;
  }
  if (errorMessage) {
    errorMessage.value = "";
  }
  model.value--;
}
</script>
