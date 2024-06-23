import {
  makeNotificationGetter,
  type NotificationMakeFnsRecord,
} from "./common";

export const WARNING_COLOR = "yellow" as const;

const warningsFns = {
  pastaRemoved: (t, click: () => MaybePromise<void>) => ({
    timeout: 7000,
    color: WARNING_COLOR,
    title: t("toast.removePasta.success.title"),
    description: t("toast.removePasta.success.message"),
    actions: [
      {
        color: "green",
        label: t("toast.removePasta.success.undoLabel"),
        block: true,
        size: "md",
        click,
      },
    ],
  }),
} as const satisfies NotificationMakeFnsRecord<typeof WARNING_COLOR>;

export type WarningNotificationName = keyof typeof warningsFns;

export const getWarningNotification = makeNotificationGetter(warningsFns);
