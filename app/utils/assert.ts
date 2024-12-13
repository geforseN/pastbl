import type { MaybeGetter } from "./types";
import { raise, type RaiseReason_ } from "./raise.ts";
import { isFunction } from "./guards.ts";

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

type TypeofReturn =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

function assertTypeof(v: unknown, t: "string"): asserts v is string;
function assertTypeof(v: unknown, t: "number"): asserts v is number;
function assertTypeof(v: unknown, t: "bigint"): asserts v is bigint;
function assertTypeof(v: unknown, t: "boolean"): asserts v is boolean;
function assertTypeof(v: unknown, t: "symbol"): asserts v is symbol;
function assertTypeof(v: unknown, t: "undefined"): asserts v is undefined;
function assertTypeof(v: unknown, t: "object"): asserts v is object;
function assertTypeof(
  value: unknown,
  type: "function"
): asserts value is (...args: unknown[]) => unknown;
function assertTypeof(value: unknown, type: TypeofReturn): asserts value is TypeofReturn {
  if (typeof value !== type) {
    throw new TypeError(`Expected ${type}, got ${typeof value}`);
  }
}

export const assert: typeof assertOk & {
  fail: typeof raise;
  ok: typeof assertOk;
  isError: typeof assertIsError;
  response: {
    ok: typeof assertResponseOk;
  };
  typeof: typeof assertTypeof;
} = function assert(...args: Parameters<typeof assertOk>) {
  assertOk(...args);
};

assert.ok = assertOk;
assert.isError = assertIsError;
assert.response = {
  ok: assertResponseOk,
};
assert.fail = raise;
assert.typeof = assertTypeof;
