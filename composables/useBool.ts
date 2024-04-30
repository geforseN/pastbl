export function useBool(initialValue: boolean) {
  const state = ref(initialValue);

  return {
    state,
    tryMakeTrue() {
      if (!state.value) {
        state.value = true;
      }
    },
    tryMakeFalse() {
      if (state.value) {
        state.value = false;
      }
    },
  };
}
