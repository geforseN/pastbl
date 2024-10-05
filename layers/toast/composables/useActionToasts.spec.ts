import { describe, it, test } from "vitest";
import { setup } from "@nuxt/test-utils";
import { createActionToasts } from "../utils/create-raw-action-toasts";
import { additionalMethods, baseMethods } from "../internal/utils";
import { useActionToasts } from "./useActionToasts";

const actionsToastsOptions = {
  i18n: { t: (text: string) => text },
} as const;

describe("useActionToasts", async () => {
  await setup({
    host: "http://127.0.0.1",
    port: 3000,
  });

  describe("with first arg as undefined", () => {
    const actionToasts = useActionToasts(undefined, actionsToastsOptions);

    describe("retrun value", () => {
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

  describe("with first arg that has success method", () => {
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
    test("return value will be function", () => {
      expect(actionToasts).toBeInstanceOf(Function);
    });
    test("return value will have 'success' method", () => {
      expect(actionToasts.success).toBeInstanceOf(Function);
    });
    test("return value and return value success method are same", () => {
      expect(actionToasts === actionToasts.success).toBe(true);
      expect(actionToasts).toBe(actionToasts.success);
    });
    test("provided args will not be ignored", () => {
      expect(actionToasts.success("test")).toEqual({
        description: "success:test",
      });
      expect(actionToasts("test")).toEqual({ description: "success:test" });
    });
    it("has raise method", () => {
      expect(actionToasts.raise).toBeInstanceOf(Function);
    });
    it("will throw on raise call", () => {
      expect(() => {
        actionToasts.raise("test");
      }).toThrowErrorMatchingInlineSnapshot(`[Error: Must panic]`);
    });
  });

  it("with arg will return additional methods", () => {
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
    expect(actionToasts).toBeInstanceOf(Function);
    expect(actionToasts.add).toBeInstanceOf(Function);
    expect(actionToasts.panic).toBeInstanceOf(Function);
    expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
    expect(Object.keys(actionToasts)).toMatchInlineSnapshot(`[]`);
    expect(Object.values(actionToasts)).toMatchInlineSnapshot(`[]`);
    expect(actionToasts.failure).toBeInstanceOf(Function);
    expect(actionToasts.warning("baz")).toEqual({ title: "baz" });
    expect(actionToasts.fail).toBeInstanceOf(Function);
    expect(actionToasts.info).toBeInstanceOf(Function);
    expect(() => actionToasts.fail("foo")).not.toThrow();
    expect(() => actionToasts.fail("fooArg", 123)).not.toThrow();
    // @ts-expect-error Argument of type '"baz"' is not assignable to parameter of type '"foo" | "fooArg"'.ts(2345)
    expect(() => actionToasts.fail("baz")).toThrow();
    expect(() => actionToasts.raise("fooArg", 123)).toThrow();
  });
});
