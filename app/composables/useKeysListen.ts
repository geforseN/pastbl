import { onKeyStroke } from "@vueuse/core";
import { isFunction } from "../utils/guards";
import { assert } from "../utils/assert";
import { navigateTo } from "#app/composables/router";
import type {
  NavigationFailure,
  RouteLocation,
  RouteLocationRaw,
} from "#vue-router";

/* eslint-disable @typescript-eslint/no-invalid-void-type */
type NavigateTo = (
  path: RouteLocation | RouteLocationRaw,
) =>
  | false
  | void
  | RouteLocationRaw
  | Promise<false | void | NavigationFailure>;
/* eslint-enable @typescript-eslint/no-invalid-void-type */

export function useKeysListenWithAlt(
  entries: [string, (go: NavigateTo) => void][],
) {
  const localePath = useLocalePath();

  const navigateTo_: NavigateTo = (path) => navigateTo(localePath(path));

  const handlersMap = new Map(entries);

  onKeyStroke((event) => {
    const { key, altKey } = event;
    if (!altKey || !handlersMap.has(key)) {
      return;
    }
    event.preventDefault();
    const handler = handlersMap.get(key);
    assert.ok(isFunction(handler));
    return handler(navigateTo_);
  });
}
