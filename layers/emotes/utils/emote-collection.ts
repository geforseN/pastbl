import type { EmoteSource, IBasicUserEmoteCollection__ } from "~/integrations";
import { flatGroupBy } from "~/utils/object";

export function flatGroupBySource<T extends { source: EmoteSource }>(
  items: T[],
) {
  return flatGroupBy(items, (item) => item.source);
}

export type SomeEmoteSource = EmoteSource | { source: EmoteSource };

export function getEmoteSource(source: SomeEmoteSource) {
  return typeof source === "string" ? source : source.source;
}

export type SelectableLogin = TwitchUserLogin | "";
export type SelectedLogin = SelectableLogin;

export type LoginSource = SelectableLogin | IBasicUserEmoteCollection__;

export function getUserLogin(loginSource: LoginSource) {
  const login =
    typeof loginSource === "string"
      ? loginSource
      : loginSource.user.twitch.login;
  assert.ok(typeof login === "string");
  return login;
}
