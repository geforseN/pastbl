type Status = "empty" | "tooShort" | "tooLong" | "ok";
type BaseOptions = { min: number; max: number };

type StatusWithWarning = Status | "warning";
type BaseOptionsWithWarning = BaseOptions & { warning: number };

type Options = BaseOptions & { warning?: number };

type ReturnOf<T> = (lengthLike: number | { length: number }) => T;

export function makeLengthStatus(options: BaseOptions): ReturnOf<Status>;
export function makeLengthStatus(
  options: BaseOptionsWithWarning,
): ReturnOf<StatusWithWarning>;
export function makeLengthStatus<O extends Options>({ min, max, warning }: O) {
  return function (lengthLike: number | { length: number }) {
    const length =
      typeof lengthLike === "number" ? lengthLike : lengthLike.length;
    if (!length) {
      return "empty";
    }
    if (length < min) {
      return "tooShort";
    }
    if (length > max) {
      return "tooLong";
    }
    if (warning && length > warning) {
      return "warning";
    }
    return "ok";
  };
}
