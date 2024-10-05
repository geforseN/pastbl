import { raiseToastMethod } from "../internal/raise-method";
import type { RawActionToastMaker, RawActionToastMakersGroup, ActionToastsPanicFn, ActionToastsPanicFn2 } from "./types";

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

type FN<Group extends RawActionToastMakersGroup> = <K extends keyof Group>(key: K, ...args: Parameters<Group[K]>) => ReturnType<Group[K]>;

type MapMethod<
  Group extends RawActionToastMakersGroup,
  NewKeys extends string,
> = Record<NewKeys, FN<Group>>;

type HasMethodGroup<V extends RawActionToastMakersGroup | undefined, OnTrue>
  = V extends RawActionToastMakersGroup ? OnTrue : Record<string, never>;

type Warning_<M extends RawActionToastsMethods> = HasMethodGroup<
  M["warnings"],
  MapMethod<NonNullable<M["warnings"]>, "warning" | "warn">
>;

type HasMethod<M extends RawActionToastMaker | undefined, OnTrue> = M extends RawActionToastMaker ? OnTrue : Record<string, never>;

type Success_<
  M extends RawActionToastsMethods,
  _M extends NonNullable<M["success"] > = NonNullable<M["success"]>,
> = HasMethod<M["success"], {
  (...args: Parameters<_M>): ReturnType<_M>;
  success: _M;
}>;

type Failure_<M extends RawActionToastsMethods> = M extends {
  failures: Record<string, RawActionToastMaker>;
} ?
& {
  [K in typeof raiseToastMethod.typeWithAlias[number]]: ActionToastsPanicFn<M["failures"]>
}
& {
  failure<K extends keyof M["failures"]>(name: K, ...args: Parameters<M["failures"][K]>): ReturnType<M["failures"][K]>;
  fail<K extends keyof M["failures"]>(name: K, ...args: Parameters<M["failures"][K]>): ReturnType<M["failures"][K]>;
}
  : {
      [K in typeof raiseToastMethod.typeWithAlias[number]]: ActionToastsPanicFn2
    };

type Info_<M extends RawActionToastsMethods> = HasMethodGroup<
  M["infos"],
  MapMethod<NonNullable<M["infos"]>, "info">
>;

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

  // TODO: add mote interceptors (and add test for then). Object.keys, Object.values...

  // TODO: test what happens when nothing is returned from maker
  // TODO: TS: add raise, throw, panic even if failures is not defined
  // TODO rename to useActionToaster

  // FIXME: autocomplete for RawActionToastsMethods object not working, should show keys of RawActionToastsMethods
  // FIXME: when in group there is method which return void
  //  e.g. let t = useActionsToasts('name', { infos: { foo() {} }}).
  // then t.info is never (need to rewrite ts condition)

  // NOTE: omit function properties (call, apply, bind, ...)
  // NOTE: this are shown when success is defined
  contextify<M extends RawActionToastsMethods>(
    i18n: VueI18n,
    add: (
      makeNotification: (i18n: ActionToastsThis["i18n"]) => Partial<Notification>
    ) => void,
    addToast: (notification: Partial<Notification>) => void,
  ) {
    const hasSuccessMethod = typeof this.methods.success === "function";
    const success: RawActionToastMaker | (() => never) = hasSuccessMethod
      ? this.methods.success!
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
          return raiseToastMethod.define(context, this.methods.failures, addToast);
        }
        if (!validTypes.includes(key)) {
          return Reflect.get(target, key, receiver);
        }
        const methodsRecordName = revertedAliases.get(key)!;
        const methodsRecord = this.methods[methodsRecordName];
        if (!methodsRecord) {
          return Reflect.get(target, key, receiver);
        }
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
    }) as {
      add: typeof add;
    } & Success_<M> & Failure_<M> & Warning_<M> & Info_<M>;
  }
}

export function createRawActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  return RawActionToast.create(actionName, actionMethods);
}

export const createActionToasts = createRawActionToasts;
