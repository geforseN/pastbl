import { isFunction } from "./guard";

export function withLogSync<T>(
  valueOrGetter: T | (() => T),
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
