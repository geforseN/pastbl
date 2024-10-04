type ActionToastsMethodsKeyToTransform = Exclude<ActionToastsMethodsKey, "success">;

const actionToastTypeKeysTransform = new Set([
  "failures", "infos", "warnings",
] as const satisfies ActionToastsMethodsKeyToTransform[]);

export const aliases = new Map([
  ["failures", ["failure", "fail"]],
  ["infos", ["info"]],
  ["warnings", ["warning", "warn"]],
] as const satisfies [ActionToastsMethodsKeyToTransform, string[]][]);

function defineTransformedToastMaker<
  K extends ActionToastsMethodsKeyToTransform,
  MS extends NonNullable<RawActionToastsMethods[K]>,
>(key: K, methods: MS) {
  if (isEmptyObject(methods)) {
    throw new TypeError("Methods must be an non-empty object");
  }
  return function <MSK extends keyof MS>(
    this: ActionToastsContext,
    methodName: MSK,
    ...args: Parameters<MS[MSK]>
  ) {
    if (typeof methodName !== "string") {
      throw new TypeError("Method name must be a string");
    }
    if (!(methodName in methods)) {
      throw new Error(`Action toast '${key}.${methodName}' not found`);
    };
    if (typeof methods[methodName] !== "function") {
      throw new TypeError(`Action toast '${key}.${methodName}' must be a function`);
    }
    const method = methods[methodName];
    const notification = method.apply(this, args) as ReturnType<MS[MSK]>;
    return notification;
  };
}

export const methodsToTransform = {
  has(key: ActionToastsMethodsKeyToTransform) {
    return actionToastTypeKeysTransform.has(key);
  },
  define: defineTransformedToastMaker,
  typeWithAlias(key: ActionToastsMethodsKeyToTransform) {
    return aliases.get(key)!;
  },
};
