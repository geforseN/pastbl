import { raiseToastMethod } from "../internal/raise-method";
import { RawActionToastsMethods_ } from "../internal/raw-methods";
import type {
  Failure_,
  Info_,
  RawActionToastMaker,
  RawActionToastsMethods,
  Success_,
  Warning_,
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

export type RawActionToastsInstance = InstanceType<typeof RawActionToast>;
