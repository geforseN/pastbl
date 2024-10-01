import type { PastaTag, Unbranded } from "~/brands";
import { ToastableError } from "$/toast/utils/abstract";
import { pastasConfig } from "$/pastas/app.config";

export class ToManyPastaTagsError extends ToastableError {
  toToast(context: ActionToastsThis) {
    return {
      description: context.i18n.t(
        "toast.addTag.fail.tooManyTags",
        pastasConfig.pastaTags.count,
      ),
      title: context.i18n.t("toast.addTag.fail.title"),
    };
  }
}

export class SamePastaTagError extends ToastableError {
  constructor(readonly pastaTag: Unbranded<PastaTag>) {
    super();
  }

  toToast(context: ActionToastsThis) {
    return {
      description: context.i18n.t("toast.addTag.fail.sameMessage", {
        tag: this.pastaTag,
      }),
      title: context.i18n.t("toast.addTag.fail.title"),
    };
  }
}

export class BadPastaTagLengthError extends ToastableError {
  constructor(readonly lengthStatus: BadLengthStatus) {
    super();
  }

  toToast(context: ActionToastsThis) {
    return {
      description: context.i18n.t(
        `toast.addTag.fail.${this.lengthStatus}Message`,
        {
          pastaTagLength: pastasConfig.pastaTag.length,
        },
      ),
      title: context.i18n.t("toast.addTag.fail.title"),
    };
  }
}
export class NonExistingPastaTagError extends ToastableError {
  toToast(context: ActionToastsThis) {
    return {
      description: context.i18n.t("toast.removeTag.fail.noExistMessage"),
      title: context.i18n.t("toast.removeTag.fail.title"),
    };
  }
}
