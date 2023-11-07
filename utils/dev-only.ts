export async function withLog<T>(
  cb: () => T | Promise<T>,
  {
    logKey,
    additionalMessage = {},
  }: { logKey: string; additionalMessage?: Record<string, unknown | never> },
): Promise<T> {
  const returnValue = await cb();
  // eslint-disable-next-line no-console
  process.dev && console.log({ [logKey]: returnValue, ...additionalMessage });
  return returnValue;
}
