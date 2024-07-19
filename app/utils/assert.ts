import { raise, type RaiseReason_ } from "./raise";

type RaiseReason = RaiseReason_ | (() => RaiseReason_);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertIsError<EC extends new (...args: any[]) => Error>(
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

function assertResponseOk(
  response: Response,
  messageOrError: string | Error = new Error(
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

export function withOkAssert<V>(reason: string) {
  return function (value: V) {
    assertOk(value, reason);
    return value;
  };
}
