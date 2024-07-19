export type RaiseReason_ = string | Error | undefined;

export function raise(messageOrError?: RaiseReason_): never {
  if (typeof messageOrError === "string") {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error(messageOrError);
  } else if (messageOrError instanceof Error) {
    throw messageOrError;
  } else {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error("Assertion failed");
  }
}
