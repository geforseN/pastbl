import { ElNotification } from "element-plus";
import type { ActionToastsThis, Notification } from "../utils/types";

export function useActionToasts<
  T extends ReturnType<typeof createActionToasts>,
>(
  actionToasts?: T,
) {
  const i18n = useI18n();
  const toast = {
    add: function adapterFromNuxtUItoElementPlus(notification: Partial<Notification>) {
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
    },
  };

  const context = reactive({ i18n: computed(() => i18n) });

  function add(
    makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification,
  ) {
    const notification = makeNotification(i18n);
    return toast.add(notification);
  }

  if (!actionToasts) {
    return { add };
  }

  const methods = actionToasts.methods.map((method) =>
    method.withContext(context),
  );

  const methodsObject = Object.fromEntries(
    methods.map(
      (method) =>
        [
          method.type,
          (...args: Parameters<typeof method.makeNotification>) => toast.add(method.makeNotification(...args)),
        ] as const,
    ),
  );

  log("debug", actionToasts.action.name, methodsObject);

  return {
    ...methodsObject,
    add,
  };
}
