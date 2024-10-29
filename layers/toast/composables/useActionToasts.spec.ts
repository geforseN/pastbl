import { describe, it, vi, expect, afterEach, test } from "vitest";
import { createRawActionToasts } from "../utils/create-raw-action-toasts.ts";
import { additionalMethods, baseMethods } from "../internal/utils.ts";
import { raiseToastMethod } from "../internal/raise-method.ts";
import { useActionToasts } from "./useActionToasts.ts";
import type { RawActionToastsMethods } from "../internal/types.ts";

function useTestActionToasts<
  N extends string,
  M extends RawActionToastsMethods,
>(methods?: M, name?: N) {
  const rawActionToasts = methods
    ? createRawActionToasts(name ?? Date.now().toString(), methods)
    : undefined;

  const options = {
    i18n: { t: (text: string) => text },
    toast: {
      add() {},
    },
  } as const;

  const addToast = vi.spyOn(options.toast, "add");

  return [
    useActionToasts(
      rawActionToasts,
      // @ts-expect-error this is simple fake object, only `t` method is needed
      options,
    ),
    addToast,
  ] as const;
}

describe("useActionToasts", async () => {
  afterEach(() => {
    vi.resetAllMocks();
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
    const [actionToasts] = useTestActionToasts();

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
    const [actionToasts, addToast] = useTestActionToasts({
      success(string: string) {
        return {
          description: this.i18n.t("success:" + string),
        };
      },
    });

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

      it("will call addToast on success call", () => {
        expect(addToast).not.toHaveBeenCalled();
        expect(actionToasts("test")).toEqual({ description: "success:test" });
        expect(addToast).toHaveBeenCalledTimes(1);
      });
    });

    describe("raise (with aliases)", () => {
      it.for(raiseToastMethod.typeWithAlias)(
        "must have \"%s\" method",
        (methodName) => {
          expect(actionToasts[methodName]).toBeInstanceOf(Function);
        },
      );
    });

    it("will throw on raise call", () => {
      expect(() => {
        actionToasts.raise("test");
      }).toThrowErrorMatchingInlineSnapshot(`[Error: Must panic]`);
    });

    it("will call addToast on raise call", () => {
      expect(addToast).not.toHaveBeenCalled();
      try {
        actionToasts.raise("test");
      } catch {
        expect(addToast).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("with rawActionToasts and all additional methods", () => {
    const [actionToasts, addToast] = useTestActionToasts({
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
    });

    describe("return value", () => {
      it("will be function", () => {
        expect(actionToasts).toBeInstanceOf(Function);
      });
      it("will match snapshot", () => {
        expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
      });
      it.for(
        [additionalMethods, raiseToastMethod.typeWithAlias, baseMethods].flat(),
      )("will have %s method", (methodName) => {
        expect(actionToasts[methodName]).toBeInstanceOf(Function);
        // NOTE: there is no property, we are using proxy
        expect(actionToasts).not.toHaveProperty(methodName);
      });

      test("other handlers in proxy are not implemented", () => {
        expect(Object.keys(actionToasts)).toMatchInlineSnapshot(`[]`);
        expect(Object.values(actionToasts)).toMatchInlineSnapshot(`[]`);
      });

      it("throws on unimplemented notification maker", () => {
        // @ts-expect-error Argument of type '"baz"' is not assignable to parameter of type '"foo" | "fooArg"'.ts(2345)
        expect(() => actionToasts.fail("baz")).toThrow();
      });

      it("will not call addToast on unimplemented notification maker", () => {
        expect(addToast).not.toHaveBeenCalled();
        try {
          // @ts-expect-error Argument of type '"baz"' is not assignable to parameter of type '"foo" | "fooArg"'.ts(2345)
          actionToasts.fail("baz");
        } catch {
          expect(addToast).not.toHaveBeenCalled();
        }
      });

      it("will not throw on implemented notification maker", () => {
        expect(() => actionToasts.fail("foo")).not.toThrow();
        expect(() => actionToasts.fail("fooArg", 123)).not.toThrow();
      });

      it("will call addToast", () => {
        expect(addToast).not.toHaveBeenCalled();
        actionToasts.fail("foo");
        expect(addToast).toHaveBeenCalledOnce();
        actionToasts.fail("fooArg", 123);
        expect(addToast).toHaveBeenCalledTimes(2);
      });
    });
  });

  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  describe.each([
    {
      methods: {
        success() {},
      },
      expected: undefined,
    },
    {
      methods: {
        success() {
          return null;
        },
      },
      expected: null,
    },
    {
      methods: {
        success() {
          return false;
        },
      },
      expected: false,
    },
  ] as const)(
    "with rawActionToasts with success that returns $expected value",
    ({ methods, expected }) => {
      afterEach(() => warn.mockReset());

      //  @ts-expect-error  Type 'undefined', 'null', 'false' is not assignable to type 'Partial<INotification>
      const [actionToasts, addToast] = useTestActionToasts(methods);

      it("will return expected", () => {
        // @ts-expect-error this is strange that ts thinks that actionToasts is not callable
        expect(actionToasts()).toEqual(expected);
      });

      it("will not throw on call", () => {
        expect(() => {
          actionToasts.success();
        }).not.toThrow();
      });

      it("will not call addToast", () => {
        expect(addToast).not.toHaveBeenCalled();
        actionToasts.success();
        expect(addToast).not.toHaveBeenCalled();
      });

      test("there is warn in console", () => {
        actionToasts.success();
        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenLastCalledWith(
          "Success method returned falsy value, should return INotification",
        );
      });
    },
  );

  describe.each([
    {
      methods: {
        warnings: {
          baz() {
            return;
          },
        },
      },
      expected: undefined,
    },
    {
      methods: {
        warnings: {
          baz() {
            return null;
          },
        },
      },
      expected: null,
    },
    {
      methods: {
        warnings: {
          baz() {
            return false;
          },
        },
      },
      expected: false,
    },
  ] as const)(
    "with rawActionToasts with warnings that returns $expected value",
    ({ methods, expected }) => {
      afterEach(() => warn.mockReset());

      //  @ts-expect-error  Type 'undefined', 'null', 'false' is not assignable to type 'INotification'
      const [actionToasts, addToast] = useTestActionToasts(methods);

      it("will return expected", () => {
        expect(actionToasts.warning("baz")).toBe(expected);
      });

      it("will not throw on call", () => {
        expect(() => {
          actionToasts.warning("baz");
        }).not.toThrow();
      });

      it("will not call addToast", () => {
        expect(addToast).not.toHaveBeenCalled();
        actionToasts.warning("baz");
        expect(addToast).not.toHaveBeenCalled();
      });

      test("there is warn in console", () => {
        actionToasts.warn("baz");
        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenLastCalledWith(
          "Method 'warn' returned falsy value, should return INotification",
        );
      });
    },
  );
});
