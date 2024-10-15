import { ToastableError } from "../utils/toastable-error.ts";
import type { INotification } from "../utils/types.ts";
import type {
  ActionToastsPanicFn,
  RaiseMethodName,
  RawActionToastsMethods,
} from "./types";

function getNotification<
  F extends NonNullable<RawActionToastsMethods["failures"]>,
  K extends keyof F,
>(
  failures: F,
  context: ActionToastsContext,
  ...args: Parameters<F[K]>
): INotification {
  const firstArgument = args[0];
  if (typeof firstArgument === "string") {
    if (firstArgument in failures) {
      return failures[firstArgument]!.apply(context, args.slice(1));
    }
    throw new Error(`Action toast 'failures.${firstArgument}' not found`);
  }
  if (!(firstArgument instanceof Error)) {
    throw new TypeError("Expected an error");
  }
  if (!(firstArgument instanceof ToastableError)) {
    return {
      title: context.i18n.t("actionToasts.genericError.title"),
      description: context.i18n.t("actionToasts.genericError.description"),
    };
  }
  return firstArgument.toToast(context);
}

function defineActionToastsRaiseMethod<
  FS extends RawActionToastsMethods["failures"],
>(
  context: ActionToastsContext,
  failures: FS,
  addToast: (toast: INotification) => void,
) {
  if (!failures || !isObject(failures)) {
    return function () {
      const notification = {
        title: context.i18n.t("actionToasts.genericError.title"),
        description: context.i18n.t("actionToasts.genericError.description"),
      };
      addToast(notification);
      throw new Error("Must panic", { cause: notification });
    };
  }
  return function (...args: Parameters<ActionToastsPanicFn<FS>>) {
    // FIXME: add type tests
    // @ts-expect-error Argument of type '[maybeError: unknown]' is not assignable to parameter of type 'Parameters<NonNullable<FS>[keyof NonNullable<FS>]>'.ts(2345)
    const notification = getNotification(failures, context, ...args);
    addToast(notification);
    throw new Error("Must panic", { cause: notification });
  };
}

const typeWithAlias = ["raise", "panic", "throw"] as const;

const typeWithAliasSet = new Set(typeWithAlias);

export function isRaisePropertyName(string: string): string is RaiseMethodName {
  return typeWithAliasSet.has(string as RaiseMethodName);
}

export const raiseToastMethod = {
  define: defineActionToastsRaiseMethod,
  typeWithAlias,
};
