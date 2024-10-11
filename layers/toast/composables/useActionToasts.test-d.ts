import { expectTypeOf, describe, test, it } from "vitest";
import { useActionToasts } from "./useActionToasts";

const actionsToastsOptions = {
  i18n: { t: (text: string) => text },
} as unknown as VueI18n;

describe("typecheck", async () => {
  test("suite 2", () => {
    const actionToasts = useActionToasts(
      createActionToasts("success", {
        success(string: string) {
          return {
            description: "success:" + string,
          };
        },
      }),
      // @ts-expect-error this fake object only have 't' method
      actionsToastsOptions,
    );

    expectTypeOf(actionToasts.add).toBeFunction();
    expectTypeOf(actionToasts.raise).toBeFunction();
    expectTypeOf(actionToasts).toBeFunction();
    expectTypeOf(actionToasts).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(actionToasts.success).toBeFunction();
  });

  describe("composable without args", () => {
    const actionToasts = useActionToasts();

    it("is function", () => {
      // actionToasts must be function, but on call it will raise because `success` method not provided
      expectTypeOf(actionToasts).toBeFunction();
    });

    it("must not have success method", () => {
      expectTypeOf(actionToasts.success).not.toBeFunction();
    });

    it("must not have additional methods", () => {
      expectTypeOf(actionToasts.warn).not.toBeFunction();
      expectTypeOf(actionToasts.warning).not.toBeFunction();
      expectTypeOf(actionToasts.fail).not.toBeFunction();
      expectTypeOf(actionToasts.failures).not.toBeFunction();
      expectTypeOf(actionToasts.info).not.toBeFunction();
    });

    it("has add method", () => {
      expectTypeOf(actionToasts.add).toBeFunction();
    });

    it("has raise methods", () => {
      expectTypeOf(actionToasts.raise).toBeFunction();
      expectTypeOf(actionToasts.panic).toBeFunction();
      expectTypeOf(actionToasts.throw).toBeFunction();
    });
  });
});
