import type { ActionToastsThis, Notification, ParsedActionToasts, RawActionToastsMethods, SoRawActionToasts } from "../utils/types";
import { adaptNotificationFromNuxtUItoElementPlus } from "../utils/public";
import { raiseToastMethod } from "../internal/raise-method";

export function useActionToasts<
  T extends {
    success?: (this: ActionToastsThis, ...args: any[]) => Partial<Notification>;
    warnings?: Record<string, (this: ActionToastsThis, ...args: any[]) => Partial<Notification>>;
    failures?: (this: ActionToastsThis, ...args: any[]) => Partial<Notification>;
    infos?: (this: ActionToastsThis, ...args: any[]) => Partial<Notification>;
  },
  S extends T["success"] = T["success"],
>(
  actionToasts: T,
  options: {
    i18n?: VueI18n;
    toast?: { add(notification: Partial<Notification>): void };
  } = {},
) {
  const {
    i18n = useI18n() as unknown as VueI18n,
    toast = {
      add: adaptNotificationFromNuxtUItoElementPlus,
    },
  } = options;

  function add(
    makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification,
  ) {
    const notification = makeNotification(i18n);
    return toast.add(notification);
  }

  if (!actionToasts) {
    // FIXME: type must be ActionToastsPanicFn
    function raise(error: unknown) {
      throw error;
    };
    const fn = () => {};
    fn.add = add;

    for (const key of raiseToastMethod.typeWithAlias) {
      fn[key] = raise;
    }
    return fn; /* as ParsedActionToasts<Record<string, never>>; */
  }

  const toastsWithContext = actionToasts.withContext({ i18n });
  toastsWithContext.add = add;

  log("debug", actionToasts.action.name, toastsWithContext);

  return toastsWithContext;/*  as ParsedActionToasts<T>; */
}
