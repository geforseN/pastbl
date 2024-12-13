import { suite, describe, it, expect } from "vitest";
import { tryDispatchEvent } from "~/utils/dom.ts";

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
