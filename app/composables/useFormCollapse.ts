export function useFormCollapse() {
  const isOpen = useIndexedDBKeyValue(
    "create-pasta-form-collapse:is-open",
    false,
  );

  return {
    isOpen: computed({
      get() {
        return isOpen.state.value;
      },
      set(value) {
        isOpen.state.value = value;
      },
    }),
    close() {
      isOpen.state.value = false;
    },
    open() {
      isOpen.state.value = true;
    },
    toggle() {
      isOpen.state.value = !isOpen.state.value;
    },
  };
}
