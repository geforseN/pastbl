import { NotFoundPastaError } from "../layers/chat-pasta/utils/pasta-errors";
import { createActionToasts } from "../../toast/utils/create-raw-action-toasts";

export const getPastaToasts = createActionToasts("get-pasta", {
  failures: {
    noEntityWithId(id: number) {
      return new NotFoundPastaError(id).toToast(this);
    },
  },
});
