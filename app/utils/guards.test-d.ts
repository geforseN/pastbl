import { expectTypeOf, describe } from "vitest";
import { isError } from "./guards.ts";

class CustomError extends Error {}

describe("isError", () => {
  const error = new CustomError("test");
  // FIXME: Argument of type 'typeof CustomError' is not assignable to parameter of type 'ErrorConstructor'.
  // Type 'typeof CustomError' provides no match for the signature '(message?: string | undefined): Error'.ts(2345)
  assert.ok(isError(error, CustomError));
  expectTypeOf(error).toBeInstanceOf(CustomError);
  expectTypeOf(error).toBeInstanceOf(Error);
});
