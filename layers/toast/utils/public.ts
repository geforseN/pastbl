import { defineRawMethods } from "../internal/raw-action-toasts";
import { createBoundActionToasts } from "../internal/bound-action-toasts";
import { wrapper } from "./dump";
import type { RawActionToastsMethods, Notification, ActionToastsContext } from "./types";

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

// TODO: use proxy instead of create many functions

export function createRawActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  return wrapper(
    actionName,
    actionMethods,
    function onBeforeReturn(_actionToasts) {
      defineRawMethods(_actionToasts, actionMethods);
      _actionToasts.withContext = function (initialContext: ActionToastsContext) {
        return createBoundActionToasts(initialContext, _actionToasts);
      };
    },
    null,
  );
}

export const createActionToasts = createRawActionToasts;
