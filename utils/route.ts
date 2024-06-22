import { isFunction } from "./guard";
import { assert } from "./error";

export function getRouteStringParam(key: string, transform?: undefined): string;
export function getRouteStringParam<T>(
  key: string,
  transform: (value: string) => T,
): T;
// NOTE: overloads is important for return type inference when second param is function
export function getRouteStringParam<T>(
  key: string,
  transform?: (value: string) => T,
) {
  // @ts-expect-error must provide param to useRoute to get type inference, however it is not needed for runtime
  const value = useRoute().params[key];
  assert.ok(typeof value === "string", `Page param ${key} must be a string`);
  if (isFunction(transform)) {
    return transform(value);
  }
  return value;
}
