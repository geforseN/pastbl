import { expectTypeOf } from "vitest";
import { isError } from "./guards.ts";

class CustomError extends Error {}

const error = new CustomError("test");
assert.ok(isError(error, CustomError));
expectTypeOf(error).toBeInstanceOf(CustomError);
expectTypeOf(error).toBeInstanceOf(Error);
