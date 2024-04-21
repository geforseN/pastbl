import {
  makeNotificationGetter,
  type NotificationMakeFnsRecord,
} from "./common";
import { pastaTextLength } from "~/config/const";

export const FAILURE_COLOR = "red" as const;

const failureFns = {
  fetchCollectionEmptyInput: (t) =>
    new ExtendedError(t("toast.loadCollection.fail.emptyInputMessage"), {
      title: t("toast.loadCollection.fail.title"),
    }),
  getPastaById: (t, __id__ /* TODO: use id in message */ : number) =>
    new ExtendedError(t("toast.getPastaIndexById.fail.message"), {
      title: t("toast.getPastaIndexById.fail.title"),
    }),
  patchPastaLastCopied: (t) =>
    new ExtendedError(t("toast.patchPatchLastCopied.fail.message"), {
      title: t("toast.patchPatchLastCopied.fail.title"),
      timeout: 7_000,
      color: "red",
    }),
  pastaPut__sameValues: (t) =>
    new ExtendedError(t("toast.putPasta.fail.sameValuesMessage"), {
      title: t("toast.putPasta.fail.title"),
    }),
  pastaCreateBadLength: (
    t,
    lengthStatus: Exclude<ReturnType<typeof getPastaLengthStatus>, "ok">,
  ) => {
    return new ExtendedError(
      t(`toast.createPasta.fail.${lengthStatus}Message`, pastaTextLength),
      {
        title: t("toast.createPasta.fail.title"),
        color: FAILURE_COLOR,
      },
    );
  },
} as const satisfies NotificationMakeFnsRecord<typeof FAILURE_COLOR>;

export type FailureNotificationName = keyof typeof failureFns;

export const getFailureNotification = makeNotificationGetter(failureFns);
