import { isFn } from "./guard";

export function getRouteStringParam(
  key: string,
  transformFn?: undefined,
): string;
export function getRouteStringParam<T>(
  key: string,
  transformFn: (value: string) => T,
): T;
// NOTE: overloads is important for return type inference when second param is function
export function getRouteStringParam<T>(
  key: string,
  transformFn?: (value: string) => T,
) {
  const value = useRoute().params[key];
  assert.ok(typeof value === "string", `Page param ${key} must be a string`);
  if (isFn(transformFn)) {
    return transformFn(value);
  }
  return value;
}
