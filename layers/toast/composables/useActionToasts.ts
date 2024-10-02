import { ElNotification } from "element-plus";
import type { ActionToastsThis, Notification } from "../utils/types";

type Basic = {
  add: (makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification) => void;
  panic: ActionToastsPanicFn<Record<string, never>>;
};

type UseActionToastsReturn<T extends ReturnType<typeof createActionToasts> | undefined> = T extends undefined ? Basic : {
  [k in keyof T["methods"]]: any
};

function adapterFromNuxtUItoElementPlus(notification: Partial<Notification>) {
  return ElNotification({
    // ...notification["icon"],
    // ...notification['ui'],
    // TODO: implement: actions
    // TODO: implement: progressBar
    // TODO: implement: onHoverStrategy: 'pause-on-enter/resume-on-leave' | 'DEFAULT:resetInterval'
    // TODO: docs: add about all above + keyboard shortcuts
    // type: mapFromNuxtUIColorToElementPlusType notification["color"]
    onClick: notification.click,
    onClose: notification.callback,
    title: notification.title,
    message: notification.description,
    duration: notification.timeout,
  });
}

export function useActionToasts<
  T extends ReturnType<typeof createActionToasts>,
>(
  actionToasts?: T,
) {
  const i18n = useI18n() as unknown as VueI18n;
  const toast = {
    add: adapterFromNuxtUItoElementPlus,
  };

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

  const methods = {
    ...toasts,
    ...actionToasts.methods.withContext(context),
  };

  log("debug", actionToasts.action.name, methods);
  return methods;
}
