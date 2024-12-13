export function useBool(initialValue: boolean) {
  const state = ref(initialValue);

  return {
    state,
    trySet(value: boolean) {
      if (state.value !== value) {
        state.value = value;
      }
    },
  };
}
