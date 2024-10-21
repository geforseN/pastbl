import { describe, expect, it, suite } from "vitest";
import { isEmptyObject } from "./guards";

suite("utils", () => {
  suite("guard", () => {
    describe("isEmptyObject", () => {
      it("must be defined", () => {
        expect(isEmptyObject).toBeDefined();
      });

      it("returns true on empty object", () => {
        expect(isEmptyObject({})).toBe(true);
        // @ts-expect-error no need to provide anything in Object
        expect(isEmptyObject(new Object())).toBe(true);
      });

      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class Empty {}

      it("asd", () => {
        // @ts-expect-error isEmptyObject argument type expect Record (object), received class instance (also object)
        expect(isEmptyObject(new Empty())).toBe(true);
      });
    });
  });
});
