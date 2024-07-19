import type { TPersonEmoteCollection } from "../PersonEmoteCollection";

export type SelectableLogin = TwitchUserLogin | "";
export type SelectedLogin = SelectableLogin;

export type LoginSource = SelectableLogin | TPersonEmoteCollection.Default;

export function getPersonLogin(loginSource: LoginSource) {
  const login =
    typeof loginSource === "string"
      ? loginSource
      : loginSource.person.twitch.login;
  assert.ok(typeof login === "string" && isLowercase(login));
  return login;
}
