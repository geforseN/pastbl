export async function withLog<T>(
  cb: () => T | Promise<T>,
  {
    logKey,
    additionalMessage = {},
  }: { logKey: string; additionalMessage?: Record<string, unknown | never> },
): Promise<T> {
  const returnValue = await cb();
  if (process.dev) {
    // eslint-disable-next-line no-console
    console.log({ [logKey]: returnValue, ...additionalMessage });
  }
  return returnValue;
}

export function withLogSync<T>(
  cb: () => T,
  optionsOrKey:
    | string
    | {
        logKey: string;
        additionalMessages?: Record<string, unknown | never>;
      },
): T {
  const returnValue = cb();
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
