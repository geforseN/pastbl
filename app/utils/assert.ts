import { raise, type RaiseReason_ } from "./raise.ts";

export type RaiseReason = MaybeGetter<RaiseReason_>;

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
    const maybeErrorLike = isFunction(reason) ? reason() : reason;
    raise(maybeErrorLike);
  }
}

function assertResponseOk(
  response: Response,
  raiseReason: RaiseReason_ = new Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (!response.ok) {
    raise(raiseReason);
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
