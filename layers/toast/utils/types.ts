import type { VueI18n } from "vue-i18n";
import type { ToastableError } from "$/toast/utils/abstract";

export type { VueI18n } from "vue-i18n";

export type ActionToastsThis = { i18n: VueI18n };

export type Notification = {
  title?: string;
  description?: string;
  timeout?: number;
  click?: (...args: unknown[]) => void;
  callback?: (...args: unknown[]) => void;
  color?: string;
};
export type PartialIdentifiableNotification<
  T extends Notification = Notification,
> = Partial<T> & {
  id: string;
};

export type NotificationColor = NonNullable<Notification["color"]>;

export type ActionToastMakers = Pick<
  ActionToasts,
  "success" | "infos" | "warnings" | "failures"
>;

export interface MakeTranslatedActionNotification {
  (this: ActionToastsThis, ...args: unknown[]): Partial<Notification>;
}

export type ActionToasts = {
  readonly action: {
    readonly name: string;
  };

  clone(
    notification: PartialIdentifiableNotification,
  ): PartialIdentifiableNotification;

  success?: MakeTranslatedActionNotification;
  warnings?: Record<string, MakeTranslatedActionNotification>;
  failures?: Record<string, MakeTranslatedActionNotification>;
  infos?: Record<string, MakeTranslatedActionNotification>;
};

export type ActionToastsPanicFn<T extends ActionToasts> =
  | (<K extends keyof T["failures"]>(
    key: K,
    ...args: Parameters<NonNullable<T["failures"]>[K]>
  ) => never)
  | ((error: Error) => never)
  | ((toastableError: ToastableError) => never)
  | ((maybeError?: unknown) => never);
