import { raiseToastMethod } from "../internal/raise-method";
import { successToastMaker } from "../internal/success-toast-maker";
import { methodsToTransform } from "../internal/methods-to-transform";
import type { RawActionToastsMethods, Notification, RawActionToastMaker } from "./types";

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
    ? successToastMaker.define(actionMethods.success)
    : function () {};

  if (isSuccessMethodProvided) {
    actionToasts["success"] = actionToasts;
  }

  Object.defineProperty(
    actionToasts,
    "action",
    { value: Object.freeze({ name: actionName }) },
  );

  for (const [key, methods] of objectEntries(<RawActionToastsMethods>actionMethods)) {
    if (!methods || key === "success") {
      continue;
    }
    if (methodsToTransform.has(key)) {
      // @ts-expect-error ts(2345) methods is object, otherwise it will throw inside define
      const toastMaker = methodsToTransform.define(key, methods);
      const actionNames = methodsToTransform.typeWithAlias(key);
      for (const name of actionNames) {
        actionToasts[name] = toastMaker;
      }
    }
    else {
      log("error", "Unknown action toast method", { key, methods });
    }
    if (key === "failures") {
      const failures = methods;
      assert.ok(isObject(failures), "Failures must be an object");
      const toastMaker = raiseToastMethod.define(failures);
      const actionNames = raiseToastMethod.typeWithAlias;
      for (const name of actionNames) {
        actionToasts[name] = toastMaker;
      }
    }
  }
  return actionToasts;
}
