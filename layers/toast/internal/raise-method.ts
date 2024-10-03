import { ToastableError } from "../utils/abstract";

function defineActionToastsRaiseMethod<FS extends NonNullable<RawActionToastsMethods["failures"]>>(
  failures: FS,
) {
  return function (
    this: ActionToastsContext,
    args: Parameters<ActionToastsPanicFn<FS>>,
  ) {
    const firstArgument = args[0];
    if (typeof firstArgument === "string") {
      if (firstArgument in failures) {
        return failures[firstArgument]!.apply(this, args.slice(1));
      }
      throw new Error(`Action toast 'failures.${firstArgument}' not found`);
    }
    if (!(firstArgument instanceof Error)) {
      throw new TypeError("Expected an error");
    }
    if (!(firstArgument instanceof ToastableError)) {
      return {
        title: this.i18n.t("actionToasts.genericError.title"),
        description: this.i18n.t("actionToasts.genericError.description"),
      };
    }
    return firstArgument.toToast(this);
  };
};

export const raiseMethod = {
  define: defineActionToastsRaiseMethod,
  get typeWithAlias() {
    return ["raise", "panic"];
  },
};
