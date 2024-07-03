export function isStringifiedNumber(string: string): string is `${number}` {
  return !Number.isNaN(Number(string));
}
export function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function isNullish<T>(value: Nullish<T>): value is null | undefined {
  return value === undefined || value === null;
}

export function isObject<T extends Record<string, unknown>>(
  object: unknown,
): object is T {
  return object !== null && typeof object === "object";
}

export function isEmptyObject(object: Record<string, unknown>) {
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in object) {
    return false;
  }
  return true;
}

export function isEmptyObject2(object: Record<string, unknown>) {
  return Object.keys(object).length === 0;
}

export function isIsoDate(string: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(string)) {
    return false;
  }
  const d = new Date(string);
  return (
    d instanceof Date &&
    !Number.isNaN(d.getTime()) &&
    d.toISOString() === string
  );
}

export function isError<E extends Error, EC extends ErrorConstructor>(
  value: unknown,
  ErrorConstructor?: EC,
): value is E {
  return value instanceof (ErrorConstructor || Error);
}

export function isFn<F extends (...args: unknown[]) => unknown>(
  maybeFunction: unknown,
): maybeFunction is F {
  return typeof maybeFunction === "function";
}

export const isFunction = isFn;

export function isIsoDate2(string: string) {
  if (string.includes("T")) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(string)) {
      return false;
    }
  } else if (!/\d{4}-\d{2}-\d{2}/.test(string)) {
    return false;
  }
  const d = new Date(string);
  return (
    d instanceof Date &&
    !Number.isNaN(d.getTime()) &&
    d.toISOString().startsWith(string)
  );
}

export const isArray = Array.isArray;

export const isStringArray = (value: unknown): value is string[] =>
  isArray(value) && value.every((v) => typeof v === "string");
