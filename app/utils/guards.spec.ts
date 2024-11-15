import { describe, expect, it, suite } from "vitest";
import * as guards from "./guards.ts";

suite("utils", () => {
  suite("guard", () => {
    describe("isEmptyObject", () => {
      it.for(
        [guards.isEmptyObject, guards.isEmptyObject2],
      )("must be defined", (isEmptyObject) => {
        expect(isEmptyObject).toBeDefined();
      });

      it.for(
        [guards.isEmptyObject, guards.isEmptyObject2],
      )("returns true on empty object", (isEmptyObject) => {
        expect(isEmptyObject({})).toBe(true);
        // @ts-expect-error no need to provide anything in Object
        expect(isEmptyObject(new Object())).toBe(true);
      });

      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class Empty {}

      it.for(
        [guards.isEmptyObject, guards.isEmptyObject2],
      )("returns true for empty class instances", (isEmptyObject) => {
        // @ts-expect-error isEmptyObject argument type expect Record (object), received class instance (also object)
        expect(isEmptyObject(new Empty())).toBe(true);
      });
    });

    describe("isError", () => {
      class CustomError extends Error {}
      const { isError } = guards;
      it.for(
        [
          isError(new CustomError("test"), CustomError),
          isError(new CustomError("test")),
          isError(new Error("test"), Error),
          isError(new Error("test"), undefined),
          isError(new Error("test")),
        ] as const,
      )("returns true for errors", (actual) => {
        expect(actual).toBe(true);
      });

      it.for([
        isError({ message: "fake error" }),
        isError(null),
        isError(undefined),
      ])("returns false for non-errors", (actual) => {
        expect(actual).toBe(false);
        expect(actual).toBe(false);
        expect(actual).toBe(false);
      });
    });
  });
});
