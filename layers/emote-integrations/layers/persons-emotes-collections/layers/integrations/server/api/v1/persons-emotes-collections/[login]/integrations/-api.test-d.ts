import { assertType, expectTypeOf, test } from "vitest";
import betterTTV from "./BetterTTV.get";

test("my types work properly", async () => {
  expectTypeOf(betterTTV).toBeFunction();
  expectTypeOf(betterTTV).returns.toBe({ integration: {} });

  assertType<{
    source: "BetterTTV";
    status: "failed";
    reason: string;
    code: string;
  }>(
    await personEmoteIntegrations.BetterTTV.get({
      login: "login",
      id: "123",
      nickname: "",
      description: "",
      avatarUrl: "",
      createdAt: "",
    }),
  );
});
