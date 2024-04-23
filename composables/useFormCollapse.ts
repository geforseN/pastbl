export function useFormCollapse() {
  const isFormCollapseOpen = useIndexedDBKeyValue(
    "create-pasta-form-collapse:is-open",
    false,
  );

  return {
    isOpen: computed({
      get() {
        return isFormCollapseOpen.state.value;
      },
      set(value) {
        isFormCollapseOpen.state.value = value;
      },
    }),
    close() {
      isFormCollapseOpen.state.value = false;
    },
    open() {
      isFormCollapseOpen.state.value = true;
    },
    toggle() {
      isFormCollapseOpen.state.value = !isFormCollapseOpen.state.value;
    },
  };
}
