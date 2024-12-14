import { pastasService } from "../../../../utils/service/singleton";
import { isPastasSame } from "../pasta";
import { assert } from "../../../../../../app/utils/assert";
import type { OmegaPasta } from "../pasta";
import type { UsePastasStateInstance } from "../../composables/usePastas";
import { useActionToasts } from "../../../../../toast/composables/useActionToasts";
import { createActionToasts } from "../../../../../toast/utils/create-raw-action-toasts";

export const putPastaToasts = createActionToasts("put-pasta", {
  success() {
    return {
      description: this.i18n.t("toast.putPasta.success.message"),
      title: this.i18n.t("toast.putPasta.success.title"),
      timeout: 3000,
    };
  },
  failures: {
    pastaNotChanged() {
      return {
        description: this.i18n.t("toast.putPasta.fail.sameValuesMessage"),
        title: this.i18n.t("toast.putPasta.fail.title"),
      };
    },
  },
});

export function usePastaPutToasts() {
  return useActionToasts(putPastaToasts);
}

export function usePastaPut(pastas: UsePastasStateInstance) {
  const __toast__ = usePastaPutToasts();

  return async function (pasta: OmegaPasta) {
    const [index, oldPasta] = await pastas
      .getEntryById(pasta.id)
      .catch(__toast__.panic);
    assert.ok(!isPastasSame(oldPasta, pasta), () =>
      __toast__.panic("pastaNotChanged"),
    );
    await pastasService.put(pasta);
    pastas.mutateAt(index, pasta);
    __toast__.success();
  };
}
