import { expectTypeOf } from "vitest";
import { useActionToasts } from "./useActionToasts";

test("my types work properly", () => {
  expectTypeOf(useActionToasts().panic(new Error("Error"))).toBeNever();
});
