import { wrapper } from "../utils/dump";

function rebindMethodsContext(
  context: ActionToastsContext,
  actionToasts: object,
  rawActionToasts: object,
) {
  // NOTE: no 'success' in array above
  const types = (["failure", "fail", "info", "warning", "warn", "panic", "raise"] as const)
    .filter((type) => type in rawActionToasts);

  for (const type of types) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionToasts[type] = rawActionToasts[type].bind(context);
  }
}

export function createBoundActionToasts(
  context: ActionToastsContext,
  someActionToasts:
  /* this is maybe raw action toasts or already has bound context */
  /* FIXME: type BoundActionToasts */
    {
      action: { name: string };
    } & RawActionToastsMethods,
) {
  return wrapper(
    someActionToasts.action.name,
    someActionToasts,
    function onBeforeReturn(_actionToasts) {
      rebindMethodsContext(context, _actionToasts, someActionToasts);

      _actionToasts.withContext = function (newContext: ActionToastsContext) {
        return createBoundActionToasts(newContext, someActionToasts);
      };
    },
    context,
  );
};
