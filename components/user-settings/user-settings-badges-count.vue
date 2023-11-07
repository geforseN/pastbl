<template>
  <div class="join relative">
    <div class="join-item grow">
      <input
        id="badges-count"
        class="input input-secondary w-full rounded-r-none border-r-0 text-lg out-of-range:!bg-error/10 hover:bg-base-300 focus:bg-base-300"
        :value="props.badgesCount"
        min="0"
        max="10"
        type="number"
        inputmode="numeric"
        name="badges-count"
        @input="handleInputChange($event)"
      />
      <label class="label" for="badges-count">
        <span class="label-text font-bold text-error">{{ errorMessage }}</span>
      </label>
    </div>
    <button
      class="btn btn-square join-item border border-secondary pb-1 text-2xl font-medium focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary"
      @click="
        () => {
          if (props.badgesCount === 0) {
            errorMessage = 'The badges count can not be negative number';
            return;
          }
          if (errorMessage) {
            errorMessage = '';
          }
          emit('update:badgesCount', props.badgesCount - 1);
        }
      "
    >
      -
    </button>
    <button
      class="btn btn-square join-item border border-secondary text-2xl font-medium focus-within:bg-secondary focus-within:outline-secondary hover:bg-secondary"
      @click="
        () => {
          if (props.badgesCount === 10) {
            errorMessage = 'The badges count can not be more than 10';
            return;
          }
          if (errorMessage) {
            errorMessage = '';
          }
          emit('update:badgesCount', props.badgesCount + 1);
        }
      "
    >
      +
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ badgesCount: number }>();
const emit = defineEmits<{ "update:badgesCount": [value: number] }>();
const errorMessage = ref("");

// TODO: use ValidityState
// LINK: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
function handleInputChange(event: unknown) {
  if (typeof event !== "object" || event === null) {
    throw new TypeError("No event provided");
  }
  if (
    !("target" in event) ||
    typeof event.target !== "object" ||
    event.target === null
  ) {
    throw new TypeError("No target provided");
  }
  if (!("value" in event.target)) {
    throw new TypeError("No value provided");
  }
  const value = Number(event.target.value);
  if (!Number.isInteger(value)) {
    throw new TypeError("Badge count must be an integer");
  }
  if (value > 10) {
    return (errorMessage.value = "The badges count can not be more than 10");
  }
  if (value < 0) {
    return (errorMessage.value = "The badges count can not be negative number");
  }
  if (errorMessage.value) {
    errorMessage.value = "";
  }
  emit("update:badgesCount", value);
}
</script>
