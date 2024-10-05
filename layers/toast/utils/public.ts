import { raiseToastMethod } from "../internal/raise-method";
import type {
  Failure_,
  Info_,
  Success_,
  Warning_,
} from "../internal/types";
import type {
  RawActionToastMaker,
  Notification,
  ActionToastsContext,
  RawActionToastsMethods,
} from "./types";

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

// class ActionToastsMethods_ {
//   constructor(private readonly methods: RawActionToastsMethods) {}
// }

export const revertedAliases = new Map([
  ["failure", "failures"],
  ["fail", "failures"],
  ["info", "infos"],
  ["warning", "warnings"],
  ["warn", "warnings"],
] as const);

type ActionToastsMethodsKeyToTransform = Exclude<ActionToastsMethodsKey, "success">;

const aliases = new Map([
  ["failures", ["failure", "fail"]],
  ["infos", ["info"]],
  ["warnings", ["warning", "warn"]],
] as const satisfies [ActionToastsMethodsKeyToTransform, string[]][]);

export const validTypes = [
  ...Array.from(aliases.values()),
  ...raiseToastMethod.typeWithAlias,
].flat();

class RawActionToastsMethods_<M extends RawActionToastsMethods> {
  constructor(public readonly methods: M) {}

  get hasSuccessMethod() {
    return typeof this.methods.success === "function";
  }

  makeHandler(key: string, context: ActionToastsContext) {
    const methodsRecordName = revertedAliases.get(key)!;
    const methodsRecord = this.methods[methodsRecordName];
    if (!methodsRecord) {
      throw new Error(`Action toast '${methodsRecordName}' not found`);
    }
    return function<
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
  }
}

export class RawActionToast<N extends string, M extends RawActionToastsMethods> {
  constructor(
    public readonly actionName: N,
    public readonly methods: RawActionToastsMethods_<M>,
  ) {}

  static create<N extends string, M extends RawActionToastsMethods>(
    actionName: N,
    actionMethods: M,
  ) {
    return new RawActionToast<N, M>(
      actionName,
      new RawActionToastsMethods_(actionMethods),
    );
  }

  // TODO: add mote interceptors (and add test for then). Object.keys, Object.values...

  // TODO: test what happens when nothing is returned from maker
  // TODO: TS: add raise, throw, panic even if failures is not defined
  // TODO rename to useActionToaster

  // NOTE: omit function properties (call, apply, bind, ...)
  // NOTE: this are shown when success is defined
  contextify<
    T extends InstanceType<typeof RawActionToast>,
    M extends T["methods"]["methods"] = T["methods"]["methods"],
  >(
    i18n: VueI18n,
    add: (
      makeNotification: (i18n: ActionToastsThis["i18n"]) => Partial<Notification>
    ) => void,
    addToast: (notification: Partial<Notification>) => void,
  ) {
    const hasSuccessMethod = typeof this.methods.methods.success === "function";
    const success: RawActionToastMaker | (() => never) = hasSuccessMethod
      ? this.methods.methods.success!
      : () => { throw new Error("Action toast 'success' not found"); };
    const context = { i18n };
    return new Proxy(success, {
      get: <K extends typeof validTypes[number] | "success" | "add">(target: typeof success, key: K, receiver: unknown) => {
        if (key === "add") {
          return add;
        }
        if (key === "success" && hasSuccessMethod) {
          return receiver;
        }
        if (raiseToastMethod.typeWithAlias.includes(key)) {
          return raiseToastMethod.define(context, this.methods.methods.failures, addToast);
        }
        if (!validTypes.includes(key)) {
          return Reflect.get(target, key, receiver);
        }
        try {
          return this.methods.makeHandler(key, context);
        }
        catch (error) {
          assert.ok(error instanceof Error, new Error("Expected an error", { cause: error }));
          assert.ok(error.message.match(/Action toast '\w+' not found/), new Error("Unexpected error", { cause: error }));
          return Reflect.get(target, key, receiver);
        }
      },
    }) as {
      add: typeof add;
    }
    & Success_<M>
    & Failure_<M>
    & Warning_<M>
    & Info_<M>;
  }
}

export function createRawActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  return RawActionToast.create(actionName, actionMethods);
}

export const createActionToasts = createRawActionToasts;
