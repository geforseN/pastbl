import { pastasService } from "../../../../utils/service/singleton";
import type { OmegaPasta } from "../pasta";
import type { UsePastasStateInstance } from "../../composables/usePastas";
import { useActionToasts } from "../../../../../toast/composables/useActionToasts";
import type { MaybePromise } from "../../../../../../app/utils/types";
import { createActionToasts } from "../../../../../toast/utils/create-raw-action-toasts";

export const pastaRemoveToasts = createActionToasts("remove-pasta", {
  infos: {
    movedInBin(onCancel: () => MaybePromise<void>) {
      return {
        title: this.i18n.t("toast.removePasta.success.title"),
        description: this.i18n.t("toast.removePasta.success.message"),
        timeout: 7000,
        actions: [
          {
            color: "green",
            label: this.i18n.t("toast.removePasta.success.undoLabel"),
            block: true,
            size: "md",
            click: onCancel,
          } as const,
        ],
      };
    },
  },
});

export function usePastaRemoveToasts() {
  return useActionToasts(pastaRemoveToasts);
}

export function usePastaRemove(pastas: UsePastasStateInstance) {
  const __toast__ = usePastaRemoveToasts();

  return async function (pasta: OmegaPasta) {
    const index = await pastas.getIndexById(pasta.id).catch(__toast__.panic);
    await pastasService.moveFromListToBin(pasta);
    pastas.removeAt(index);
    __toast__.info("movedInBin", async function onCancel() {
      await pastasService.moveFromBinToList(pasta);
      pastas.pushAt(index, pasta);
    });
  };
}
