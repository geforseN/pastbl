import { pastasConfig } from "~~/layers/pastas/app.config";
import {
  makeNotificationGetter,
  type NotificationMakeFnsRecord,
} from "./-common";
import { ExtendedError } from "~/utils/error";

export const FAILURE_COLOR = "red" as const;

const failureFns = {
  fetchCollection__emptyInput: (t) =>
    new ExtendedError(t("toast.loadCollection.fail.emptyInputMessage"), {
      title: t("toast.loadCollection.fail.title"),
    }),
  pastaPut__sameValues: (t) =>
    new ExtendedError(t("toast.putPasta.fail.sameValuesMessage"), {
      title: t("toast.putPasta.fail.title"),
    }),
  copyText__genericFail: (t) => ({
    description: t("toast.copyText.fail.genericMessage"),
    timeout: 7000,
    color: "red",
  }),
  copyText__clipboardFail: (t) => ({
    description: t("toast.copyText.fail.clipboardMessage"),
    color: "red",
  }),
} as const satisfies NotificationMakeFnsRecord<typeof FAILURE_COLOR>;

const ADD_PASTA_TAG_FAIL_TITLE = "toast.addTag.fail.title";

const noLocaleFailures = {
  createPasta__badLength(
    lengthStatus: Exclude<ReturnType<typeof getPastaLengthStatus>, "ok">,
  ) {
    return new ExtendedError(`toast.createPasta.fail.${lengthStatus}Message`, {
      title: "toast.createPasta.fail.title",
      color: FAILURE_COLOR,
      mustAddLocale: true,
      tDescriptionInterpolations: { pastaTextLength: pastasConfig.pastaText.length },
    });
  },
  getPasta__noEntityWithId(id: number) {
    return new ExtendedError(
      "toast.getPastaIndexById.fail.noEntityWithSuchId",
      {
        title: "toast.getPastaIndexById.fail.title",
        color: FAILURE_COLOR,
        mustAddLocale: true,
        tDescriptionInterpolations: { id },
      },
    );
  },
  addPastaTag__badLength(status) {
    return new ExtendedError(`toast.addTag.fail.${status}Message`, {
      title: ADD_PASTA_TAG_FAIL_TITLE,
      color: FAILURE_COLOR,
      mustAddLocale: true,
      tDescriptionInterpolations: {
        pastaTagLength: pastasConfig.pastaTag.length,
      },
    });
  },
  addPastaTag__sameTag(tag: string) {
    return new ExtendedError("toast.addTag.fail.sameMessage", {
      title: ADD_PASTA_TAG_FAIL_TITLE,
      color: FAILURE_COLOR,
      mustAddLocale: true,
      tDescriptionInterpolations: { tag },
    });
  },
  addPastaTag__toManyTags() {
    return new ExtendedError("toast.addTag.fail.toManyMessage", {
      title: ADD_PASTA_TAG_FAIL_TITLE,
      color: FAILURE_COLOR,
      mustAddLocale: true,
      tDescriptionInterpolations: pastasConfig.pastaTags.count,
    });
  },
  removePastaTag__noExist() {
    return new ExtendedError("toast.removeTag.fail.noExistMessage", {
      title: "toast.removeTag.fail.title",
      color: FAILURE_COLOR,
      mustAddLocale: true,
    });
  },
} as const satisfies NotificationMakeFnsRecord<typeof FAILURE_COLOR, true>;

export type FailureNotificationName = keyof typeof failureFns;

export const getFailureNotification = makeNotificationGetter(failureFns);

export function createNoTranslationFailureNotification<
  K extends keyof typeof noLocaleFailures,
>(name: K, ...args: Parameters<(typeof noLocaleFailures)[K]>): ExtendedError {
  return noLocaleFailures[name](...args);
}
