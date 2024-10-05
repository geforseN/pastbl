import { expectTypeOf, describe, test } from "vitest";
// import { setup } from "@nuxt/test-utils";
import { useActionToasts } from "./useActionToasts";

const actionsToastsOptions = {
  i18n: { t: (text: string) => text },
} as unknown as VueI18n;

// FIXME: make it work
describe("typecheck", async () => {
  // await setup({
  //   host: "http://127.0.0.1",
  //   port: 3000,
  // });
  // expectTypeOf(useActionToasts(undefined, actionsToastsOptions).panic(new Error("Error"))).toBeNever();
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
