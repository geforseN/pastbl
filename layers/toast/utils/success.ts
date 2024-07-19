import {
  makeNotificationGetter,
  type NotificationMakeFnsRecord,
} from "./-common";

export const SUCCESS_COLOR = "green" as const;

const successFns = {
  pastaCopied: (t) => ({
    color: SUCCESS_COLOR,
    timeout: 1700,
    title: t("toast.copyPasta.success"),
  }),
  textCopied: (t) => ({
    color: SUCCESS_COLOR,
    timeout: 1700,
    title: t("toast.copyText.success"),
  }),
  collectionFetched: (t, nickname: string, statuses: string) => ({
    color: SUCCESS_COLOR,
    description: t("toast.loadCollection.success.message", {
      nickname,
      statuses,
    }),
    timeout: 7000,
    title: t("toast.loadCollection.success.title"),
  }),
  pastaPut: (t) => ({
    color: SUCCESS_COLOR,
    description: t("toast.putPasta.success.message"),
    timeout: 3000,
    title: t("toast.putPasta.success.title"),
  }),
  pastaCreated: (t) => ({
    color: SUCCESS_COLOR,
    title: t("toast.createPasta.success.title"),
  }),
} as const satisfies NotificationMakeFnsRecord<typeof SUCCESS_COLOR>;

export type SuccessNotificationName = keyof typeof successFns;

export const getSuccessNotification = makeNotificationGetter(successFns);
