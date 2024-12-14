import { useActionToasts } from "../../../../toast/composables/useActionToasts";
import type { BadLengthStatus } from "../../../../../app/utils/length-status";
import { createActionToasts } from "../../../../toast/utils/create-raw-action-toasts";
import { ToManyPastaTagsError, SamePastaTagError, BadPastaTagLengthError } from "./pasta-tag-errors";

export const addPastaTagToasts = createActionToasts("add-pasta-tag", {
  failures: {
    badLength(status: BadLengthStatus) {
      return new BadPastaTagLengthError(status).toToast(this);
    },
    sameTag(tag: string) {
      return new SamePastaTagError(tag).toToast(this);
    },
    toManyTags() {
      return new ToManyPastaTagsError().toToast(this);
    },
  },
});

export function usePastaTagAddToasts() {
  return useActionToasts(addPastaTagToasts);
}
