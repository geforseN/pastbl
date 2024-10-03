import { methodsToTransform } from "./methods-to-transform";
import { raiseToastMethod } from "./raise-method";

export function defineRawMethods(
  rawActionsToasts: object,
  rawActionToastsMethods: RawActionToastsMethods,
) {
  for (const [key, methods] of objectEntries(rawActionToastsMethods)) {
    if (!methods || key === "success") {
      continue;
    }
    if (methodsToTransform.has(key)) {
      // @ts-expect-error ts(2345) methods is object, otherwise it will throw inside define
      const toastMaker = methodsToTransform.define(key, methods);
      const actionNames = methodsToTransform.typeWithAlias(key);
      for (const name of actionNames) {
        rawActionsToasts[name] = toastMaker;
      }
    }
    else {
      log("error", "Unknown action toast method", { key, methods });
    }
    if (key === "failures") {
      const failures = methods;
      assert.ok(isObject(failures), "Failures must be an object");
      const toastMaker = raiseToastMethod.define(failures);
      const actionNames = raiseToastMethod.typeWithAlias;
      for (const name of actionNames) {
        rawActionsToasts[name] = toastMaker;
      }
    }
  }
}
