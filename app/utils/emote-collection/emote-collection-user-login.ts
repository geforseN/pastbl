import type { IBasicUserEmoteCollection } from "~/integrations";

export type SelectableLogin = TwitchUserLogin | "";
export type SelectedLogin = SelectableLogin;

export type LoginSource = SelectableLogin | IBasicUserEmoteCollection;

export function getUserLogin(loginSource: LoginSource) {
  const login =
    typeof loginSource === "string"
      ? loginSource
      : loginSource.user.twitch.login;
  assert.ok(typeof login === "string");
  return login;
}
