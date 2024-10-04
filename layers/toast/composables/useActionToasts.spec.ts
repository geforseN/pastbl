import { describe, it, test } from "vitest";
import { setup } from "@nuxt/test-utils";
import { createActionToasts } from "../utils/public";
import type { RawActionToastsMethods } from "../utils/types";
import type { ActionToastType } from "../utils/dump";
import { useActionToasts } from "./useActionToasts";

const actionsToastsOptions = {
  i18n: { t: (text: string) => text },
} as const;

function useTestActionToasts(actionName: string, methods: RawActionToastsMethods) {
  return useActionToasts(
    createActionToasts(actionName, methods),
    actionsToastsOptions,
  );
}

const additionalMethods = ["warning", "success", "failure", "info"] as const satisfies ActionToastType[];

const baseMethods = ["add", "raise"] as const;

describe("useActionToasts", async () => {
  await setup({
    host: "http://127.0.0.1",
    port: 3000,
  });

  describe.skip("with first arg as undefined returned value", () => {
    const actionToasts = useActionToasts(undefined, actionsToastsOptions);

    test("return value matches snapshot", () => {
      expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
    });

    it.for(baseMethods)("must have %s method", (methodName) => {
      expect(actionToasts[methodName]).toBeInstanceOf(Function);
    });
    it.for(additionalMethods)("must not have %s method", (methodName) => {
      expect(actionToasts[methodName]).toBeUndefined();
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
      } as const),
      actionsToastsOptions,
    );

    test("return value will be function", () => {
      expect(actionToasts).toBeInstanceOf(Function);
    });
    test("return value will have 'success' method", () => {
      expect(actionToasts.success).toBeInstanceOf(Function);
    });
    test("return value and return value success method are same", () => {
      expect(actionToasts).toBe(actionToasts.success);
    });
    test("provided args will not be ignored", () => {
      expect(actionToasts.success("test")).toEqual({ description: "success:test" });
      expect(actionToasts("test")).toEqual({ description: "success:test" });
    });
  });

  it("with arg will return additional methods", () => {
    const actionToasts = useActionToasts(
      createActionToasts("f", {
        failures: {
          bad() {
            return {};
          },
        },
      }),
      actionsToastsOptions,
    );
    actionToasts?.success?.("123");
    actionToasts?.success?.(123);
    actionToasts("123");
    actionToasts(123);

    expect(actionToasts.add).toBeInstanceOf(Function);
    expect(actionToasts.raise).toBeInstanceOf(Function);
    expect(actionToasts).toMatchInlineSnapshot(`[Function]`);
    expect(actionToasts.failure).toBeInstanceOf(Function);
    expect(actionToasts.fail).toBeInstanceOf(Function);
    expect(() => actionToasts.fail("t")).toThrow();
  });
});
