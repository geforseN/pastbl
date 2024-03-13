export function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export const isObject = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null && typeof obj === "object";

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
    return false;
  }
  const d = new Date(str);
  return (
    d instanceof Date && !Number.isNaN(d.getTime()) && d.toISOString() === str
  );
}

export function isFn<F extends (...args: unknown[]) => unknown>(
  maybeFn: unknown,
): maybeFn is F {
  return typeof maybeFn === "function";
}

export function isIsoDate2(str: string) {
  if (str.includes("T")) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)) {
      return false;
    }
  } else if (!/\d{4}-\d{2}-\d{2}/.test(str)) {
    return false;
  }
  const d = new Date(str);
  return (
    d instanceof Date &&
    !Number.isNaN(d.getTime()) &&
    d.toISOString().startsWith(str)
  );
}

export const isArray = Array.isArray;

export const isStringArray = (value: unknown): value is string[] =>
  isArray(value) && value.every((v) => typeof v === "string");
