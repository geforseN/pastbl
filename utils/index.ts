export function isNotNullish<T>(value: T): value is NonNullable<T> {
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

export function writableComputedForKey<
  T extends object,
  K extends keyof T,
  V = T[K],
>(ref_: Ref<T>, key: K) {
  return computed({
    get() {
      return ref_.value[key] as V;
    },
    set(value: V) {
      (ref_.value[key] as V) = value;
    },
  });
}
