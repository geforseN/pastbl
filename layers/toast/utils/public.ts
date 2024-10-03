import { raiseToastMethod } from "../internal/raise-method";
import { successToastMaker } from "../internal/success-toast-maker";
import { methodsToTransform } from "../internal/methods-to-transform";
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

function hasSuccessMethod(
  value: unknown,
): value is { success(...args: unknown[]): unknown } {
  return (
    typeof value === "function"
    || (typeof value === "object" && value !== null)
  )
  && "success" in value
  && typeof value.success === "function";
}

function createActionToastsWithContext(
  context: ActionToastsContext,
  rawActionToasts: {
    action: { name: string };
  } & RawActionToastsMethods,
) {
  return wrapper(
    rawActionToasts.action.name,
    rawActionToasts,
    function onBeforeReturn(_actionToasts) {
      bindContextToRawMethods(context, _actionToasts, rawActionToasts);

      _actionToasts.withContext = function (newContext: ActionToastsContext) {
        return createActionToastsWithContext(newContext, rawActionToasts);
      };
    },
    context,
  );
};

function defineRawMethods(
  rawActionsToasts: object,
  rawActionToastsMethods: RawActionToastsMethods,
) {
  for (const [key, methods] of objectEntries(rawActionToastsMethods)) {
    if (!methods || key === "success") {
      continue;
    }
    if (methodsToTransform.has(key)) {
      // @ts-expect-error ts(2345) methods is object, otherwise it will throw inside define
      const toastMaker = methodsToTransform.define(key, methods);
      const actionNames = methodsToTransform.typeWithAlias(key);
      for (const name of actionNames) {
        rawActionsToasts[name] = toastMaker;
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
        rawActionsToasts[name] = toastMaker;
      }
    }
  }
}

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
        return createActionToastsWithContext(initialContext, _actionToasts);
      };
    },
    null,
  );
}

export const createActionToasts = createRawActionToasts;

function bindContextToRawMethods(
  context: ActionToastsContext,
  actionToasts: object,
  rawActionToasts: object,
) {
  // NOTE: no 'success' in array above
  const types = ["failure", "fail", "info", "warning", "warn", "panic", "raise"]
    .filter((type) => type in rawActionToasts);

  for (const type of types) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionToasts[type] = rawActionToasts[type].bind(context);
  }
}

function wrapper(
  actionName: string,
  methods: RawActionToastsMethods,
  onBeforeReturn: (actionToasts: object) => void,
  context: ActionToastsContext | null = null,
) {
  const isSuccessMethodProvided = hasSuccessMethod(methods);

  const actionToasts: {
    (...args: unknown[]): unknown;
  } & {
    success(...args: unknown[]): unknown;
  } = isSuccessMethodProvided
    // @ts-expect-error ts is right here, context should not be null, but it it is because i18n is depend on Vue setup. then there must be right context
    ? successToastMaker.define(methods.success).bind(context)
    : function () {}.bind(context);

  if (isSuccessMethodProvided) {
    actionToasts["success"] = actionToasts;
  }

  Object.defineProperty(
    actionToasts,
    "action",
    { value: Object.freeze({ name: actionName }) },
  );

  onBeforeReturn(actionToasts);

  return actionToasts;
}
