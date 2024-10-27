import { expect as baseExpect } from "@nuxt/test-utils/playwright";
import type { Page } from "@playwright/test";

export const endToEndTestsGlobs = ["{layers,app}/**/*.e2e.spec.ts"] as const;

export { test } from "@nuxt/test-utils/playwright";

export const expect = baseExpect.extend<{
  toHaveNoSkeleton(page: Page): Promise<{ message(): string; pass: boolean; name: string }>;
}>({
      async toHaveNoSkeleton(locator: Page) {
        let pass = false;
        try {
          await baseExpect(
            locator.getByTestId("chat-pasta-list-skeleton"),
          ).toBeHidden();
          pass = true;
        } catch {
          pass = false;
        }

        return {
          message: () => "noSkeleton",
          pass,
          name: "noSkeleton",
        };
      },
    });
