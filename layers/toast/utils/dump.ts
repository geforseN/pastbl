import { successToastMaker } from "../internal/success-toast-maker";
import type { RawActionToastsMethods } from "./types";

export type ActionToastType = "success" | "failure" | "info" | "warning";

export type ActionToastsMethodsKey = keyof RawActionToastsMethods;

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

export function wrapper(
  actionName: string,
  /* FIXME: this can be not only raw. we will use this to create new methods with new context */
  methods: RawActionToastsMethods,
  onBeforeReturn: (actionToasts) => void,
  context: ActionToastsContext | null = null,
) {
  const isSuccessMethodProvided = hasSuccessMethod(methods);

  const actionToasts = isSuccessMethodProvided
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
