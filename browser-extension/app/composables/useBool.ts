/**
 * @param {Boolean} [defaultValue=false] - default value is false
 */
export function useBool(defaultValue = false) {
  const state = ref(defaultValue);
  return {
    state,
    toggle() {
      state.value = !state.value;
    },
  };
}
