// TODO: remove below line
// import type { NuxtI18nOptions, VueI18nConfig } from "@nuxtjs/i18n";
import { type VueI18nTranslation } from "vue-i18n";
import type { OmitFirst } from "../types";

export type TFn = VueI18nTranslation;

export type UseNuxtToastReturn = ReturnType<typeof useNuxtToast>;
export type Notification = Parameters<UseNuxtToastReturn["add"]>[0];
export type NotificationColor = NonNullable<Notification["color"]>;

export type NotificationMakeFnsRecord<C extends NotificationColor> = Readonly<
  Record<string, (t: TFn, ...args: any[]) => Notification & { color: C }>
>;

// TODO: remove below
// type Rec<C extends NotificationColor> = Parameters<
//   typeof makeNotificationGetter<C>
// >[0];

export function makeNotificationGetter<
  C extends NotificationColor,
  R extends NotificationMakeFnsRecord<C>,
>(record: R) {
  const map = new Map(objectEntries(record));

  return function <K extends keyof R>(
    t: TFn,
    name: K,
    // NOTE: must use OmitFirst to avoid TFn
    ...args: OmitFirst<R[K]>
  ) {
    const getNotification = map.get(name);
    assert.ok(getNotification, `No toast found for key=${t}`);
    const notification = getNotification(t, ...args);
    return notification;
  };
}
