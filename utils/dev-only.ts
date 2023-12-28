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
