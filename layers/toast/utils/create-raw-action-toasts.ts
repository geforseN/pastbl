import {
  isRaisePropertyName,
  raiseToastMethod,
} from "../internal/raise-method";
import { RawActionToastsMethods_ } from "../internal/raw-methods";
import type {
  ContextifyActionToasts,
  PossibleProperty,
  RawActionToastMaker,
  RawActionToastsMethods,
} from "../internal/types";
import { validTypes } from "../internal/utils";

class RawActionToast<N extends string, M extends RawActionToastsMethods> {
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

  contextify<
    T extends InstanceType<typeof RawActionToast>,
    M extends T["methods"]["methods"] = T["methods"]["methods"],
  >(
    i18n: VueI18n,
    add: (
      makeNotification: (
        i18n: ActionToastsThis["i18n"],
      ) => Partial<Notification>,
    ) => void,
    addToast: (notification: Partial<Notification>) => void,
  ) {
    const context = { i18n };
    const hasSuccessMethod = typeof this.methods.methods.success === "function";
    const success: RawActionToastMaker | (() => never) = hasSuccessMethod
      ? (...args: Parameters<NonNullable<M["success"]>>) => {
          const success = this.methods.methods.success;
          assert.ok(
            typeof success === "function",
            new Error("Action toast 'success' is not a function"),
          );
          const notification = success.apply(context, args);
          if (notification) {
            addToast(notification);
          }
          else {
            // eslint-disable-next-line no-console
            console.warn(
              "Success method returned falsy value, should return Partial<Notification>",
            );
          }
          return notification;
        }
      : () => {
          throw new Error("Action toast 'success' not found");
        };
    return new Proxy(success, {
      get: <K extends PossibleProperty>(
        target: typeof success,
        key: K,
        receiver: typeof success,
      ) => {
        if (key === "add") {
          return add;
        }
        if (key === "success") {
          return receiver;
        }
        if (isRaisePropertyName(key)) {
          return raiseToastMethod.define(
            context,
            this.methods.methods.failures,
            addToast,
          );
        }
        if (!validTypes.includes(key)) {
          return Reflect.get(target, key, receiver);
        }
        try {
          return this.methods.makeHandler(key, context, addToast);
        }
        catch (error) {
          assert.ok(
            error instanceof Error,
            new Error("Expected an error", { cause: error }),
          );
          assert.ok(
            error.message.match(/Action toast '\w+' not found/),
            new Error("Unexpected error", { cause: error }),
          );
          return Reflect.get(target, key, receiver);
        }
      },
    }) as ContextifyActionToasts<M>;
  }
}

export function createRawActionToasts<
  T extends string,
  A extends RawActionToastsMethods,
>(actionName: T, actionMethods: A) {
  return RawActionToast.create(actionName, actionMethods);
}

export const createActionToasts = createRawActionToasts;

export type RawActionToastsInstance = InstanceType<typeof RawActionToast>;
