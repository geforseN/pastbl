import { type VueI18nTranslation } from "vue-i18n";

export type TranslateFn = VueI18nTranslation;

export type UseNuxtToastReturn = ReturnType<typeof useNuxtToast>;
export type Notification = Parameters<UseNuxtToastReturn["add"]>[0] & {
  mustAddLocale?: boolean;
};

export type NotificationColor = NonNullable<Notification["color"]>;

export type NotificationMakeFnsRecord<
  NC extends NotificationColor,
  MustAddLocale extends boolean = false,
  N extends Notification & { color: NC } = Notification & { color: NC },
> = Readonly<
  Record<
    string,
    MustAddLocale extends true
      ? (...args: any[]) => N
      : (t: TranslateFn, ...args: any[]) => N
  >
>;

export function makeNotificationGetter<
  C extends NotificationColor,
  R extends NotificationMakeFnsRecord<C>,
>(record: R) {
  const map = new Map(objectEntries(record));

  return function <K extends keyof R>(
    t: TranslateFn,
    name: K,
    // NOTE: must use OmitFirst to avoid TFn
    ...args: OmitFirst<R[K]>
  ) {
    const getNotification = map.get(name);
    assert.ok(
      isFunction(getNotification),
      `No toast found for key=${String(name)}`,
    );
    const notification = getNotification(t, ...args);
    return notification;
  };
}
