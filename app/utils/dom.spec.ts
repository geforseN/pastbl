// @vitest-environment node
import { describe, suite, expect, it } from "vitest";
import { tryDispatchEvent } from "./dom";

describe("utils", () => {
  suite("dom", () => {
    suite("tryDispatchEvent", () => {
      it("not throws on server side when second parameter is not provided", () => {
        expect(() => tryDispatchEvent("test")).not.toThrowError();
      });
    });
  });
});
