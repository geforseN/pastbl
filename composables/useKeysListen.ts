import type {
  NavigationFailure,
  RouteLocation,
  RouteLocationRaw,
} from "#vue-router";

type GoFn = (
  path: RouteLocation | RouteLocationRaw,
) =>
  | false
  | void
  | RouteLocationRaw
  | Promise<false | void | NavigationFailure>;

export function useKeysListenWithAlt(entries: [string, (go: GoFn) => void][]) {
  const localePath = useLocalePath();

  const go: GoFn = (path) => navigateTo(localePath(path));

  const handlersMap = new Map(entries);

  onKeyStroke((event) => {
    const { key, altKey } = event;
    if (!altKey || !handlersMap.has(key)) {
      return;
    }
    event.preventDefault();
    const handler = handlersMap.get(key);
    assert.ok(handler instanceof Function);
    return handler(go);
  });
}
