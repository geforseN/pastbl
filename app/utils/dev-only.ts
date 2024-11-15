import { isFunction } from "./guards.ts";

let consolaPromise: Promise<typeof import("consola")>;

export function log<
  T extends import("consola").LogType,
>(...args: [type: T, key: string, value?: Record<string, unknown>]) {
  if (import.meta.dev) {
    const [type, key, value] = args;
    consolaPromise ??= import("consola");
    consolaPromise.then(({ consola }) => {
      consola[type](args.length > 2 ? { [key]: value } : key);
    });
  }
}

export function withLogSync<T>(
  valueOrGetter: MaybeGetter<T>,
  optionsOrKey:
    | string
    | {
      logKey: string;
      additionalMessages?: Record<string, unknown | never>;
    },
): T {
  const returnValue = isFunction(valueOrGetter)
    ? valueOrGetter()
    : valueOrGetter;
  if (import.meta.dev) {
    if (typeof optionsOrKey === "string") {
      // eslint-disable-next-line no-console
      console.log({ [optionsOrKey]: returnValue });
    } else {
      // eslint-disable-next-line no-console
      console.log({
        [optionsOrKey.logKey]: returnValue,
        ...optionsOrKey.additionalMessages,
      });
    }
  }
  return returnValue;
}
