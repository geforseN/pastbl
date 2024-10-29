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
          "foo",
          "",
          "-1",
          "0",
        ])("cursor is null when %s", (cursor) => {
          expect(parseQuery({ cursor })).toEqual({ cursor: null });
        });

        const number = 1;
        test.for([
          `${number}`,
          `${number}.0`,
          `${number}.123`,
          `${number}foo`,
        ])(`cursor is ${number} when %s`, (cursor) => {
          expect(parseQuery({ cursor })).toEqual({ cursor: number });
        });
      });
    });
  });
});
