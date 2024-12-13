import { computed } from "vue";
import { useIndexedDBKeyValue } from "../../../../key-value/indexed-db/composables/useIndexedDBKeyValue";

export function usePastaFormCollapse() {
  const isOpen = useIndexedDBKeyValue("pasta-form:is-open", false);

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
