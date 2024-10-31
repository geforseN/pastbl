/**
 * @param {Boolean} [defaultValue=false] - default value is false
 */
export function useVisibility(defaultValue = false) {
  const isVisible = ref(defaultValue);

  return {
    isVisible,
    toggle() {
      isVisible.value = !isVisible.value;
    },
  };
}
