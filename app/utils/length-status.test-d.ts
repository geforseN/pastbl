import { expectTypeOf, test } from "vitest";
import {
  makeLengthStatusGetter,
  type LengthStatus,
  type LengthStatusWithWarning,
} from "~/utils/length-status";

test("makeLengthStatusGetter types are correct", () => {
  const noWarningChecker = makeLengthStatusGetter({
    max: 10,
    min: 0,
  });
  const warningChecker = makeLengthStatusGetter({
    max: 10,
    min: 0,
    warning: 5,
  });
  expectTypeOf(noWarningChecker).returns.toEqualTypeOf<LengthStatus>;
  expectTypeOf(warningChecker).returns.toEqualTypeOf<LengthStatusWithWarning>;
  // @ts-expect-error warning not in options, so return type can not be LengthStatusWithWarning
  expectTypeOf(noWarningChecker).returns.toEqualTypeOf<LengthStatusWithWarning>;
});
