import { ToastableError } from "$/toast/utils/abstract";
import { pastasConfig } from "$/pastas/app.config";

export class NotFoundPastaError extends ToastableError {
  constructor(readonly pastaId: OmegaPastaId) {
    super();
  }

  override toToast(context: ActionToastsThis) {
    return {
      description: context.i18n.t(
        "toast.getPastaIndexById.fail.noEntityWithSuchId",
        { id: this.pastaId },
      ),
      title: context.i18n.t("toast.getPastaIndexById.fail.title"),
    };
  }
}

export class BadPastaTextLengthError extends ToastableError {
  constructor(readonly lengthStatus: BadLengthStatus) {
    super();
  }

  override toToast(context: ActionToastsThis) {
    const descriptionKey = `toast.createPasta.fail.${this.lengthStatus}Message`;
    if (!context.i18n.te(descriptionKey)) {
      log("error", "badPastaTextLength translation key not found", {
        descriptionKey,
        lengthStatus: this.lengthStatus,
      });
    }
    return {
      description: context.i18n.t(descriptionKey, {
        pastaTextLength: pastasConfig.pastaText.length,
      }),
      title: context.i18n.t("toast.createPasta.fail.title"),
    };
  }
}
