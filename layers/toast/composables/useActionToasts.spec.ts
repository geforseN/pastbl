import { describe, it } from "vitest";
import { setup } from "@nuxt/test-utils";
import { createActionToasts } from "../utils/create-raw-action-toasts";
import { additionalMethods, baseMethods } from "../internal/utils";
import { raiseToastMethod } from "../internal/raise-method";
import { useActionToasts } from "./useActionToasts";

const actionsToastsOptions = {
  i18n: { t: (text: string) => text },
} as const;

describe("useActionToasts", async () => {
  await setup({
    host: "http://127.0.0.1",
    port: 3000,
  });

  test("additional methods match snapshot", () => {
    expect(additionalMethods).toMatchInlineSnapshot(`
      [
        "failure",
        "fail",
        "info",
        "warning",
        "warn",
      ]
    `);
  });

  test("raise types (with aliases) matches snapshot", () => {
    expect(raiseToastMethod.typeWithAlias).toMatchInlineSnapshot(`
        [
          "raise",
          "panic",
          "throw",
        ]
      `);
  });

  test("base methods match snapshot", () => {
    expect(baseMethods).toMatchInlineSnapshot(`
      [
        "add",
        "raise",
        "panic",
        "throw",
      ]
    `);
  });

  describe("with rawActionToasts as undefined", () => {
    const actionToasts = useActionToasts(undefined, actionsToastsOptions);

    describe("return value", () => {
      it("will be function", () => {
        expect(actionToasts).toBeInstanceOf(Function);
      });

      it("matches snapshot", () => {
        expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
      });

      it.for(baseMethods)("must have %s method", (methodName) => {
        expect(actionToasts[methodName]).toBeInstanceOf(Function);
      });

      it.for(additionalMethods)("must not have %s method", (methodName) => {
        expect(actionToasts[methodName]).toBeUndefined();
      });
    });
  });

  describe("with rawActionToasts that has success method", () => {
    const actionToasts = useActionToasts(
      createActionToasts("success", {
        success(string: string) {
          return {
            description: "success:" + string,
          };
        },
      }),
      actionsToastsOptions,
    );

    describe("return value", () => {
      it("will be function", () => {
        expect(actionToasts).toBeInstanceOf(Function);
      });

      // this is very important, returned value has alias as success method
      // if there will be not same then we need to test method and return value is same scenarios
      it("is same as success method are same", () => {
        expect(actionToasts).toBe(actionToasts.success);
      });

      it("will not ignore provided arguments", () => {
        expect(actionToasts("test")).toEqual({ description: "success:test" });
      });
    });

    describe("raise (with aliases)", () => {
      it.for(raiseToastMethod.typeWithAlias)("must have \"%s\" method", (methodName) => {
        expect(actionToasts[methodName]).toBeInstanceOf(Function);
      });
    });

    it("will throw on raise call", () => {
      expect(() => {
        actionToasts.raise("test");
      }).toThrowErrorMatchingInlineSnapshot(`[Error: Must panic]`);
    });
  });

  it("with rawActionToasts and all additional methods", () => {
    const actionToasts = useActionToasts(
      createActionToasts("f", {
        failures: {
          foo() {
            return {};
          },
          fooArg(baz: number) {
            return {
              title: String(baz),
            };
          },
        },
        warnings: {
          baz() {
            return {
              title: "baz",
            };
          },
          bub() {
            return {};
          },
        },
        infos: {
          bar() {
            return {};
          },
        },
      }),
      actionsToastsOptions,
    );

    describe("return value", () => {
      it("will be function", () => {
        expect(actionToasts).toBeInstanceOf(Function);
      });
      it("will match snapshot", () => {
        expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
      });
      it.for([
        additionalMethods,
        raiseToastMethod.typeWithAlias,
        baseMethods,
      ].flat(),
      )("will have %s method", (methodName) => {
        expect(actionToasts).toHaveProperty(methodName);
      });

      test("other handlers in proxy are not implemented", () => {
        expect(Object.keys(actionToasts)).toMatchInlineSnapshot(`[]`);
        expect(Object.values(actionToasts)).toMatchInlineSnapshot(`[]`);
      });

      it("throws on unimplemented notification maker", () => {
      // @ts-expect-error Argument of type '"baz"' is not assignable to parameter of type '"foo" | "fooArg"'.ts(2345)
        expect(() => actionToasts.fail("baz")).toThrow();
      });
      it("will not throw on implemented notification maker", () => {
        expect(() => actionToasts.fail("foo")).not.toThrow();
        expect(() => actionToasts.fail("fooArg", 123)).not.toThrow();
      });
    });
  });
});
