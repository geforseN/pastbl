import { raiseToastMethod } from "../internal/raise-method";
import { defineSuccessToastMaker } from "../internal/success-toast-maker";
import { actionToastMakerToTransform } from "../internal/toast-maker-to-transform";
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
    if (actionToastMakerToTransform.has(key)) {
      // @ts-expect-error methods is object, it will throw otherwise
      const toastMaker = actionToastMakerToTransform.define(key, methods);
      const actionNames = actionToastMakerToTransform.typeWithAlias(key);
      for (const name of actionNames) {
        actionToasts[name] = toastMaker;
      }
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
