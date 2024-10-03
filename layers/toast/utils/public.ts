import { defineSuccessToastMaker } from "../internal/success-toast-maker";
import { ToastableError } from "./abstract";
import { actionToastTypeKeysTransform as actionToastMethodsKeyTransform, type ActionToastType } from "./dump";
import type { ActionToastsContext, RawActionToastsMethods, Notification, RawActionToastMaker } from "./types";

export function adaptNotificationFromNuxtUItoElementPlus(notification: Partial<Notification>) {
  return ElNotification({
    // ...notification["icon"],
    // ...notification['ui'],
    // TODO: implement: actions
    // TODO: implement: progressBar
    // TODO: implement: onHoverStrategy: 'pause-on-enter/resume-on-leave' | 'DEFAULT:resetInterval'
    // TODO: docs: add about all above + keyboard shortcuts
    onClick: notification.click,
    onClose: notification.callback,
    title: notification.title,
    message: notification.description,
    duration: notification.timeout,
  });
}

function hasSuccessMethod(actionMethods: RawActionToastsMethods): actionMethods is { success: RawActionToastMaker } {
  return typeof actionMethods?.success === "function";
}

export function createActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  const isSuccessMethodProvided = hasSuccessMethod(actionMethods);

  const actionToasts = isSuccessMethodProvided
    ? defineSuccessToastMaker(actionMethods.success)
    : function () {};

  if (isSuccessMethodProvided) {
    actionToasts["success"] = actionToasts;
  }

  Object.defineProperty(actionToasts, "action", { value: Object.freeze({ name: actionName }) });

  for (const [key, methods] of objectEntries(<RawActionToastsMethods>actionMethods)) {
    if (!methods || key === "success") {
      continue;
    }
    else if (actionToastMethodsKeyTransform.has(key)) {
      const transformedKey = actionToastMethodsKeyTransform.get(key)!;
      actionToasts[transformedKey] = function (
        this: ActionToastsContext,
        methodName: keyof A[typeof key],
        ...args: Parameters<NonNullable<A[typeof key]>[typeof methodName]>
      ) {
        if (typeof methodName !== "string") {
          throw new TypeError("Method name must be a string");
        }
        if (!(methodName in methods)) {
          throw new Error(`Action toast '${key}.${methodName}' not found`);
        };
        // @ts-expect-error methods is object, we can get property here
        const method = methods[methodName] as NonNullable<A[typeof key]>[typeof methodName];
        const notification = method.apply(this, args);
        return notification;
      };
      if (key === "failures") {
        const failures = methods;
        assert.ok(isObject(failures), "Failures must be an object");
        actionToasts["raise"] = function (
          this: ActionToastsContext,
          args: Parameters<ActionToastsPanicFn<typeof actionMethods["failures"]>>,
        ): Partial<Notification> {
          const firstArgument = args[0];
          if (typeof firstArgument === "string") {
            if (firstArgument in failures) {
              return failures[firstArgument]!.apply(this, args.slice(1));
            }
            throw new Error(`Action toast 'failures.${firstArgument}' not found`);
          }
          if (!(firstArgument instanceof Error)) {
            throw new TypeError("Expected an error");
          }
          if (!(firstArgument instanceof ToastableError)) {
          // TODO: here we can use this.i18n.e(actionName)
            return {
              title: this.i18n.t("toast.genericError.title"),
              description: this.i18n.t("toast.genericError.description"),
            };
          }
          return firstArgument.toToast(this);
        };
      }
    }
  }
  return actionToasts;
}
