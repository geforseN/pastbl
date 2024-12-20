import { adaptNotificationFromNuxtUItoElementPlus } from "../utils/adapter.ts";
import type { RawActionToastsInstance } from "../utils/create-raw-action-toasts.ts";
import type { ActionToastsThis, INotification } from "../utils/types.ts";

// TODO: rename to useActionToaster ?

export function useActionToasts<T extends RawActionToastsInstance>(
  actionToasts: T = createActionToasts(new Date().toString(), {}) as T,
  options: {
    i18n?: VueI18n;
    toast?: { add(notification: INotification): void };
  } = {},
) {
  const {
    i18n = useI18n() as unknown as VueI18n,
    toast = {
      add: adaptNotificationFromNuxtUItoElementPlus,
    },
  } = options;

  function add(
    makeNotification: (i18n: ActionToastsThis["i18n"]) => INotification,
  ) {
    const notification = makeNotification(i18n);
    return toast.add(notification);
  }

  const finalActionToasts = actionToasts.contextify<T>(i18n, add, toast.add);

  log("debug", actionToasts.actionName, {
    toastsWithContext: finalActionToasts,
  });

  return finalActionToasts;
}
