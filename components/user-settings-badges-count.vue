<template>
  <div class="join relative">
    <div class="join-item grow">
      <input
        class="input input-secondary w-full rounded-r-none border-r-0 text-lg"
        id="badges-count"
        :value="props.badgesCount"
        @input="handleInputChange($event)"
        min="0"
        max="10"
        type="number"
        name="badges-count"
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

async function handleInputChange(event: unknown) {
  if (typeof event !== "object" || event === null) {
    throw new TypeError();
  }
  if (
    !("target" in event) ||
    typeof event.target !== "object" ||
    event.target === null
  ) {
    throw new TypeError();
  }
  if (!("value" in event.target)) {
    throw new TypeError();
  }
  const value = Number(event.target.value);
  if (!Number.isInteger(value)) {
    throw new TypeError();
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
