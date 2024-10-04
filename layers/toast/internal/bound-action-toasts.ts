import { wrapper } from "../utils/dump";
import { aliases } from "./methods-to-transform";
import { raiseToastMethod } from "./raise-method";

export const validTypes = [
  ...Array.from(aliases.values()),
  ...raiseToastMethod.typeWithAlias,
].flat();

function rebindMethodsContext(
  context: ActionToastsContext,
  actionToasts: object,
  oldActionToasts: object,
) {
  const types = validTypes.filter((type) => type in oldActionToasts);

  for (const type of types) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionToasts[type] = oldActionToasts[type].bind(context);
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
