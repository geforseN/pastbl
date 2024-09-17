import { describe, expect, it, suite } from "vitest";
import { tryDispatchEvent } from "./dom";

suite("utils", () => {
  suite("dom", () => {
    describe("tryDispatchEvent", () => {
      it("not throws on server side when second parameter is not provided", () => {
        expect(typeof window).toBe("undefined");
        expect(() => tryDispatchEvent("test")).not.toThrowError();
      });
    });
  });
});
