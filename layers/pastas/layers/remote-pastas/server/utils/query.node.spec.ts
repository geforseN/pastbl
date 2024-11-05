import { describe, expect, test } from "vitest";
import { pastasCursorQuerySchema } from "./query.ts";

describe("remote-pastas", () => {
  describe("server", () => {
    describe("utils", () => {
      const parseQuery = pastasCursorQuerySchema.parse.bind(pastasCursorQuerySchema);

      describe("pastasCursorQuerySchema.parse", () => {
        test.for(
          [{ arg: null }, { arg: undefined }, { arg: 1 }],
        )("throws on %o", ({ arg }) => {
          expect(() => parseQuery(arg)).toThrow();
        });

        test.for([
          {},
          { cursor: undefined },
          { cursor: null },
          { cursor: "foo" },
          { cursor: "" },
          { cursor: "-1" },
          { cursor: "0" },
        ])("cursor is null when query is %o", (query) => {
          expect(parseQuery(query)).toEqual({ cursor: null });
        });

        const number = 1;
        test.for([
          { cursor: `${number}` },
          { cursor: `${number}.0` },
          { cursor: `${number}.123` },
          { cursor: `${number}foo` },
        ])(`cursor is ${number} when query is %o`, (query) => {
          expect(parseQuery(query)).toEqual({ cursor: number });
        });
      });
    });
  });
});
