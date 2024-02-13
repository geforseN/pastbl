export function isNotNullish<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}
export function booleanish<B extends boolean>(value: B) {
  return String(value) as "true" | "false";
}

export function getLengthStatus(
  length: number,
  options: { min: number; max: number },
) {
  if (!length) {
    return "empty";
  }
  if (length < options.min) {
    return "tooShort";
  }
  if (length > options.max) {
    return "tooLong";
  }
  return "ok";
}
