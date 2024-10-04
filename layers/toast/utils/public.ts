import { validTypes } from "../internal/bound-action-toasts";
import { revertedAliases } from "../internal/methods-to-transform";
import { raiseToastMethod } from "../internal/raise-method";

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

// class RawActionToastsMethods_ {
//   constructor(private readonly methods: RawActionToastsMethods) {}
//   get hasSuccessMethod() {
//     return typeof this.methods.success === "function";
//   }
// }

// class ActionToastsMethods_ {
// }

// function methodsToTransform<
//   MethodsRecord extends Record<string, RawActionToastMaker>,
//   MethodsRecordKey extends keyof MethodsRecord,
// >(
//   this: {
//     methodsRecordName: Exclude<ActionToastsMethodsKey, "success">;
//     methodsRecord: MethodsRecord;
//     context: ActionToastsContext;
//   },
//   methodName: MethodsRecordKey,
//   ...args: Parameters<MethodsRecord[MethodsRecordKey]>
// ): ReturnType<MethodsRecord[MethodsRecordKey]> {
//   const { methodsRecord, methodsRecordName } = this;
//   if (typeof methodName !== "string") {
//     throw new TypeError("Method name must be a string");
//   }
//   if (!(methodName in methodsRecord)) {
//     throw new Error(`Action toast '${methodsRecordName}.${methodName}' not found`);
//   };
//   const method = methodsRecord[methodName];
//   if (typeof method !== "function") {
//     throw new TypeError(`Action toast '${methodsRecordName}.${methodName}' must be a function`);
//   }
//   const notification = method.apply(this.context, args);
//   return notification as ReturnType<MethodsRecord[MethodsRecordKey]>;
// }

export class RawActionToast<N extends string, M extends RawActionToastsMethods> {
  constructor(
    public readonly actionName: N,
    public readonly methods: M,
  ) {}

  static create<N extends string, M extends RawActionToastsMethods>(
    actionName: N,
    actionMethods: M,
  ) {
    return new RawActionToast<N, M>(
      actionName,
      actionMethods,
    );
  }

  contextify(
    i18n: VueI18n,
    add: (
      makeNotification: (i18n: ActionToastsThis["i18n"]) => Partial<Notification>
    ) => void,
  ) {
    const hasSuccessMethod = typeof this.methods.success === "function";
    const success: RawActionToastMaker | (() => never) = hasSuccessMethod
      ? this.methods.success!
      : () => { throw new Error("Action toast 'success' not found"); };
    const context = { i18n };
    return new Proxy<object>(success, {
      get: <K extends typeof validTypes[number] | "success" | "add">(target: typeof success, key: K, receiver: object) => {
        if (key === "add") {
          return add;
        }
        if (key === "success") {
          return receiver;
        }
        if (!validTypes.includes(key)) {
          return Reflect.get(target, key, receiver);
        }
        if (raiseToastMethod.typeWithAlias.includes(key)) {
          assert.ok(isObject(this.methods.failures), "Failures must be an object");
          return raiseToastMethod.define(this.methods.failures, context);
        }
        const methodsRecordName = revertedAliases.get(key)!;
        const methodsRecord = this.methods[methodsRecordName];
        assert.ok(isObject(methodsRecord), `${methodsRecordName} must be an object`);
        return function <
          MethodsRecord extends typeof methodsRecord,
          MethodsRecordKey extends keyof MethodsRecord,
        >(
          methodName: MethodsRecordKey,
          ...args: Parameters<MethodsRecord[MethodsRecordKey]>
        ): ReturnType<MethodsRecord[MethodsRecordKey]> {
          if (typeof methodName !== "string") {
            throw new TypeError("Method name must be a string");
          }
          if (!(methodName in methodsRecord)) {
            throw new Error(`Action toast '${methodsRecordName}.${methodName}' not found`);
          };
          const method = methodsRecord[methodName];
          if (typeof method !== "function") {
            throw new TypeError(`Action toast '${methodsRecordName}.${methodName}' must be a function`);
          }
          const notification = method.apply(context, args);
          return notification as ReturnType<MethodsRecord[MethodsRecordKey]>;
        };
      },
    });
  }
}

export function createRawActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  return RawActionToast.create(actionName, actionMethods);
}

export const createActionToasts = createRawActionToasts;
