import { useActionToasts } from "../../../../toast/composables/useActionToasts";
import { createActionToasts } from "../../../../toast/utils/create-raw-action-toasts";
import { NonExistingPastaTagError } from "./pasta-tag-errors";

export const removePastaTagToasts = createActionToasts("remove-pasta-tag", {
  failures: {
    nonExistentTag() {
      return new NonExistingPastaTagError().toToast(this);
    },
  },
});

export function usePastaTagRemoveToasts() {
  return useActionToasts(removePastaTagToasts);
}
