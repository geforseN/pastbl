import type { ActionToastMakers, Notification } from "./types";

export function isNotificationHasId<T extends Partial<Notification>>(
  notification: T,
): notification is { id: string } & T {
  return typeof notification.id === "string";
}

function withContext(
  this: { id: string; type: string; makeNotification(): Partial<Notification> },
  context: ActionToastsThis,
) {
  return {
    id: this.id,
    type: this.type,
    makeNotification: this.makeNotification.bind(context),
  };
}

const ACTION_TOASTS_NOTIFICATION_TYPE_COLORS = {
  info: "blue",
  failure: "red",
  success: "green",
  warning: "yellow",
  panic: "red",
} as const;

const methodsFactories = {
  success<AN extends string, RM extends MakeTranslatedActionNotification>(
    actionName: AN,
    rawMaker: RM,
  ) {
    return [makeSuccessActionHandler(actionName, rawMaker)];
  },
  failures<
    AN extends string,
    RMS extends Record<string, MakeTranslatedActionNotification>,
  >(actionName: AN, rawMakers: RMS) {
    return [
      makeFailureActionHandler(actionName, rawMakers),
      makePanicActionHandler(actionName, rawMakers),
    ];
  },
  infos<
    AN extends string,
    RMS extends Record<string, MakeTranslatedActionNotification>,
  >(actionName: AN, rawMakers: RMS) {
    return [makeInfoActionHandler(actionName, rawMakers)];
  },
  warnings<
    AN extends string,
    RMS extends Record<string, MakeTranslatedActionNotification>,
  >(actionName: AN, rawMakers: RMS) {
    return [makeWarningActionHandler(actionName, rawMakers)];
  },
} as const;

const actionToastsKeyToTypeRecord = {
  success: "success",
  failures: "failure",
  infos: "info",
  warnings: "warning",
} as const satisfies Record<keyof ActionToastMakers, string>;

function mapActionToastsKeyToType<K extends keyof ActionToastMakers>(key: K) {
  return actionToastsKeyToTypeRecord[key];
}

export function createActionToasts<
  T extends string,
  A extends ActionToastMakers,
>(actionName: T, toastsMakers: A) {
  const methods = makeActionToastsMethods(actionName, toastsMakers);
  const actionToasts = {
    action: { name: actionName },
    methods,
  };
  Object.defineProperty(actionToasts, "action", {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return actionToasts;
}

function makeActionToastsMethods<
  AN extends string,
  A extends ActionToastMakers,
>(actionName: AN, toastsMakers: A) {
  const entries = objectEntries(toastsMakers as ActionToastMakers).flatMap(
    ([key, rawMakerOrMakers]) => {
      const makeMethod = methodsFactories[key];
      assert.ok(makeMethod);
      return makeMethod(actionName, rawMakerOrMakers);
    },
  );
  return entries;
}

function makeSuccessActionHandler<
  AN extends string,
  RM extends (...args: unknown[]) => Partial<Notification>,
>(actionName: AN, rawMaker: RM) {
  const id = (actionName + "::success") as `${AN}::success`;
  const type = "success" as const;
  return {
    id,
    type,
    makeNotification: function (
      this: ActionToastsThis,
      ...args: Parameters<RM>
    ) {
      const notification = rawMaker.call(this, ...args);
      return {
        type,
        color: ACTION_TOASTS_NOTIFICATION_TYPE_COLORS.success,
        ...notification,
        id,
      };
    },
    withContext,
  };
}

function makePanicActionHandler<
  AN extends string,
  RMS extends NonNullable<ActionToastMakers["failures"]>,
>(actionName: AN, rawMakers: RMS) {
  const id = (actionName + "::panic") as `${AN}::panic`;
  const color = ACTION_TOASTS_NOTIFICATION_TYPE_COLORS["panic"];
  const type = "panic" as const;
  return {
    id,
    type,
    makeNotification<K extends string & keyof RMS>(
      this: ActionToastsThis,
      methodName: K,
      ...args: Parameters<RMS[K]>
    ) {
      const makeNotification_ = rawMakers[methodName];
      assert.ok(makeNotification_);
      const notification = makeNotification_.call(this, ...args);
      return {
        color,
        type,
        ...notification,
        id: id + "::" + methodName,
      };
    },
    withContext,
  };
}

const makeWarningActionHandler = makeActionHandlerOf("warnings");
const makeInfoActionHandler = makeActionHandlerOf("infos");
const makeFailureActionHandler = makeActionHandlerOf("failures");

function makeActionHandlerOf<
  T extends string &
    Extract<keyof ActionToastMakers, "infos" | "warnings" | "failures">,
>(type: T) {
  const mappedType = mapActionToastsKeyToType(type);
  const color = ACTION_TOASTS_NOTIFICATION_TYPE_COLORS[mappedType];
  const postfix = "::" + mappedType;
  return function <
    AN extends string,
    RMS extends NonNullable<ActionToastMakers[T]>,
  >(actionName: AN, rawMakers: RMS) {
    const id = (actionName + postfix) as `${AN}::${typeof mappedType}`;
    return {
      id,
      type: mappedType,
      makeNotification<K extends string & keyof RMS>(
        this: ActionToastsThis,
        methodName: K,
        ...args: Parameters<RMS[K]>
      ) {
        const makeNotification_ = rawMakers[methodName];
        assert.ok(makeNotification_);
        const notification = makeNotification_.call(this, ...args);
        return {
          color,
          type: mappedType,
          ...notification,
          id: id + "::" + methodName,
        };
      },
      withContext,
    };
  };
}

////////////////////

export const getPastaToasts = createActionToasts("get-pasta", {
  failures: {
    noEntityWithId(this: ActionToastsThis, id: number) {
      return new NotFoundPastaError(id).toToast(this);
    },
  },
});

////////////////////
