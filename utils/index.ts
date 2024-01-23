export function isNotNullish<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}
export function booleanish<B extends boolean>(value: B) {
  return String(value) as "true" | "false";
}
