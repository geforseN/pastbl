// import { useRoute } from "#imports";
// import { RouteParams, RouteNames } from "vue-router/auto";
// import { RouteNamedMap } from "vue-router/auto/routes";
// type g = { [k in keyof RouteNamedMap]: RouteParams<k> };
// type gg = g[keyof g];
// type ggg = {
// export function getRouteStringParam<K extends keyof RouteNamedMap, T>(
//   key: keyof RouteParams<K>,
//   transformFn: (value: string) => T,
// ): T;
import { isFn } from "./guard";
import { assert } from "./error";

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
