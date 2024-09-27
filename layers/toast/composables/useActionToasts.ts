import type { ActionToastsThis, Notification } from "../utils/types";
import { ElNotification } from "element-plus";

export function useActionToasts<
  T extends ReturnType<typeof createActionToasts>,
>(
  actionToasts?: T,
  options: {
    i18n?: ReturnType<typeof useI18n>;
    toast?: { add(notification: Partial<Notification>): void };
  } = {},
) {
  const {
    i18n = useI18n(),
    toast = {
      add(notification) {
        return ElNotification({
          ...notification,
          progressBar: true,
          message: notification.description,
          duration: notification.timeout,
        });
      },
    },
  } = options;

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
          (...args) => toast.add(method.makeNotification(...args)),
        ] as const,
    ),
  );

  log("debug", actionToasts.action.name, methodsObject);

  return {
    ...methodsObject,
    add,
  };
}
