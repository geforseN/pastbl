import type { ActionToastsThis, Notification, ParsedActionToasts } from "../utils/types";
import { adaptNotificationFromNuxtUItoElementPlus } from "../utils/public";

type Basic = {
  add: (makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification) => void;
  panic: ActionToastsPanicFn<Record<string, never>>;
};

type UseActionToastsReturn<T extends ReturnType<typeof createActionToasts> | undefined> = T extends undefined ? Basic : {
  [k in keyof T["methods"]]: any
};

export function useActionToasts<
  T extends ParsedActionToasts,
>(
  actionToasts?: T,
  options: {
    i18n?: VueI18n;
    toast?: { add(notification: Notification): void };
  } = {},
) {
  const {
    i18n = useI18n() as unknown as VueI18n,
    toast = {
      add: adaptNotificationFromNuxtUItoElementPlus,
    },
  } = options;

  const toasts = {
    add(
      makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification,
    ) {
      const notification = makeNotification(i18n);
      return toast.add(notification);
    },
    // FIXME: type must be ActionToastsPanicFn
    raise(error: unknown) {
      throw error;
    },
  };

  if (!actionToasts) {
    return toasts;
  }

  const context = { i18n };
  const methods = actionToasts.withContext?.(context) || {};

  Object.assign(toasts, methods);

  log("debug", actionToasts.action.name, methods);
  return toasts;
}
