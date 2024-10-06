import { expectTypeOf, describe, test } from "vitest";
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
      // @ts-expect-error this mock only have 't' method
      actionsToastsOptions,
    );

    expectTypeOf(actionToasts.add).toBeFunction();
    expectTypeOf(actionToasts.raise).toBeFunction();
    expectTypeOf(actionToasts).toBeFunction();
    expectTypeOf(actionToasts).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(actionToasts.success).toBeFunction();
  });
});
