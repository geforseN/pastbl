import { isFunction } from "./guards";

export function log<L extends keyof Pick<typeof console, "debug" | "info" | "warn" | "error">>(
  level: L,
  key: string,
  value?: Record<string, unknown>,
) {
  if (import.meta.dev) {
    const object = { [key]: level };
    if (arguments.length > 2) {
      // @ts-expect-error value will be logged if developer provided third argument
      object.value = value;
    }
    // eslint-disable-next-line no-console
    console[level]();
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
