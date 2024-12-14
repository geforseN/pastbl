import type { MaybeGetter } from "~/utils/types";
import { isFunction } from "~/utils/guards.ts";

export type LengthStatus = "empty" | "tooShort" | "tooLong" | "ok";
export type BaseLengthOptions = { min: number; max: number };
export type BadLengthStatus = Exclude<LengthStatus, "ok">;

export type LengthStatusWithWarning = LengthStatus | "warning";
export type BaseLengthOptionsWithWarning = BaseLengthOptions & {
  warning: number;
};

type Options = BaseLengthOptions | BaseLengthOptionsWithWarning;

export type LengthStatusChecker<S extends LengthStatus> = (
  lengthLike: number | { length: number },
) => S;

export function makeLengthStatusGetter<O extends Options>(
  options: MaybeGetter<O>,
): LengthStatusChecker<
  // @ts-expect-error function overload are failed to make return correct type, must use conditional type
    O["warning"] extends number ? LengthStatusWithWarning : LengthStatus
  > {
  // @ts-expect-error function overload are failed to make return correct type, must use conditional type
  const { max, min, warning } = isFunction(options) ? options() : options;
  // @ts-expect-error function overload are failed to make return correct type, must use conditional type
  return function (lengthLike: number | { length: number }) {
    const length
      = typeof lengthLike === "number" ? lengthLike : lengthLike.length;
    if (!length) {
      return "empty";
    }
    if (length < min) {
      return "tooShort";
    }
    if (length > max) {
      return "tooLong";
    }
    if (warning !== undefined && length > warning) {
      return "warning";
    }
    return "ok";
  };
}
