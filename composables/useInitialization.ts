export function useInitialization(initialValue: boolean) {
  const state = ref(initialValue);

  return {
    state,
    tryStart() {
      if (!state.value) {
        state.value = true;
      }
    },
    tryStop() {
      if (state.value) {
        state.value = false;
      }
    },
  };
}
