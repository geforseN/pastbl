<template>
  <div class="join">
    <button
      class="btn btn-secondary join-item"
      @click="$emit('back')"
    >
      &lt;&lt;
    </button>
    <div
      class="join-item mx-auto flex w-64 items-center justify-center border border-secondary text-center"
    >
      <input
        id="current-pasta-number"
        v-model.trim="selectedNumber"
        type="text"
        inputmode="numeric"
        pattern="\d*"
        data-test="found-pastas:selected-number"
        class="input-xs w-12 rounded border-0 bg-base-100 text-end text-base text-base-content underline decoration-secondary underline-offset-2 hover:outline hover:outline-1"
        name="found-pasta-number"
        min="0"
        :max="pastasCount > 0 ? pastasCount : 0"
      />
      <span>/</span>
      <span class="w-12 px-2 text-start">{{ pastasCount }}</span>
    </div>
    <button
      class="btn btn-secondary join-item"
      @click="$emit('forward')"
    >
      &gt;&gt;
    </button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  pastasCount: number;
}>();

defineEmits<{
  forward: [];
  back: [];
}>();

const selectedNumber = defineModel<number>("selectedNumber", {
  required: true,
  set(_value) {
    const int
      = typeof _value === "string"
        ? _value === ""
          ? 0
          : Number.parseInt(_value, 10)
        : _value;
    const { pastasCount } = props;
    log(
      "debug",
      "(find-pastas) [found-pastas-list-navigation-bar] changing input value",
      { from: selectedNumber.value, to: _value, toParsed: int, pastasCount },
    );
    if (Number.isNaN(int)) {
      return selectedNumber.value;
    }
    if (int > pastasCount) {
      return pastasCount;
    }
    if (int < 0) {
      return 0;
    }
    return int;
  },
});
</script>
