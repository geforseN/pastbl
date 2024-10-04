import { ToastableError } from "../utils/abstract";

function defineActionToastsRaiseMethod<FS extends NonNullable<RawActionToastsMethods["failures"]>>(
  failures: FS,
  context: ActionToastsContext,
) {
  return function (
    args: Parameters<ActionToastsPanicFn<FS>>,
  ) {
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
  };
};

const typeWithAlias = ["raise", "panic", "throw"] as const;

export const raiseToastMethod = {
  define: defineActionToastsRaiseMethod,
  typeWithAlias,
};
