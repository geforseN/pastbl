import { objectKeys } from "./object";
import { assert } from "./error";

export async function withLog<T>(
  cbOrValue: MaybePromise<T> | (() => MaybePromise<T>),
  optionsOrKey:
    | string
    | {
        logKey: string;
        additionalMessages?: Record<string, unknown | never>;
      },
): Promise<T> {
  const returnValue =
    cbOrValue instanceof Function ? await cbOrValue() : await cbOrValue;
  if (process.dev) {
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

export function withLogSync<T>(
  cbOrValue: T | (() => T),
  optionsOrKey:
    | string
    | {
        logKey: string;
        additionalMessages?: Record<string, unknown | never>;
      },
): T {
  const returnValue = cbOrValue instanceof Function ? cbOrValue() : cbOrValue;
  if (process.dev) {
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

export function countKeys<T extends Record<string, unknown>>(array: T[]) {
  if (!process.dev) {
    return;
  }
  return array.reduce(
    (acc, value) => {
      objectKeys(value).forEach((key) => {
        assert.ok(typeof key === "string");
        if (key.startsWith("codeOriginal") && key.length > 5) {
          console.log(key, value);
        }
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );
}
