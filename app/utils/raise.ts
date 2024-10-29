export type RaiseReason_ = string | Error | undefined;

export function raise(reason?: RaiseReason_): never {
  if (typeof reason === "string") {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error(reason);
  } else if (reason instanceof Error) {
    throw reason;
  } else {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error("Assertion failed");
  }
}
