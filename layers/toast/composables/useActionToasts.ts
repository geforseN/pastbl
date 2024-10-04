import type { ActionToastsThis, Notification } from "../utils/types";
import { adaptNotificationFromNuxtUItoElementPlus, type RawActionToast } from "../utils/public";

export function useActionToasts<T extends InstanceType<typeof RawActionToast>>(
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

  const toastsWithContext = actionToasts.contextify({ i18n }, add);

  log("debug", actionToasts.actionName, toastsWithContext);

  return toastsWithContext;
}
