import type { NotificationColor } from "~/utils/toast/common";

type RaiseReason_ = string | Error | undefined;

type RaiseReason = RaiseReason_ | (() => RaiseReason_);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertIsError<EC extends new (...args: any[]) => Error>(
  maybeError: unknown,
  ErrorConstructor?: EC,
): asserts maybeError is InstanceType<EC> {
  if (!(maybeError instanceof (ErrorConstructor || Error))) {
    throw new TypeError("Expected an error");
  }
}

function assertOk(value: unknown, reason?: RaiseReason): asserts value {
  if (!value) {
    const maybeErrorLike = typeof reason === "function" ? reason() : reason;
    raise(maybeErrorLike);
  }
}

export function assertNeverEver(
  value: unknown,
  reason?: RaiseReason,
): asserts value {
  if (!value) {
    const maybeErrorLike = typeof reason === "function" ? reason() : reason;
    raise(maybeErrorLike);
  }
}

function assertResponseOk(
  response: Response,
  messageOrError: string | Error = Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (!response.ok) {
    raise(messageOrError);
  }
}

export const assert: {
  fail: typeof raise;
  ok: typeof assertOk;
  isError: typeof assertIsError;
  response: {
    ok: typeof assertResponseOk;
  };
} = {
  ok: assertOk,
  isError: assertIsError,
  response: {
    ok: assertResponseOk,
  },
  fail: raise,
};

export function raise(messageOrError?: string | Error): never {
  if (typeof messageOrError === "string") {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error(messageOrError);
  } else if (messageOrError instanceof Error) {
    throw messageOrError;
  } else {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error("Assertion failed");
  }
}

export class ExtendedError extends Error {
  description: string;
  title?: string;
  color: NotificationColor;
  timeout: number;

  constructor(
    message: string,
    {
      title,
      color = "red",
      timeout = 5_000,
    }: { title?: string; color?: NotificationColor; timeout?: number } = {},
  ) {
    super(message);
    this.description = message;
    this.title = title;
    this.color = color;
    this.timeout = timeout;
  }
}

export function withOkAssert<V>(reason: string) {
  return function (value: V) {
    assertOk(value, reason);
    return value;
  };
}
