import { isLowercase } from "../../../../../app/utils/string";
import { assert } from "../../../../../app/utils/assert";
import { Default } from "../shared/types/namespace";
import type * as TPersonEmoteCollection from "../shared/types/namespace";

export type SelectableLogin = TwitchUserLogin | "";
export type SelectedLogin = SelectableLogin;

export type LoginSource = SelectableLogin | TPersonEmoteCollection.Default;

export function getPersonLogin(loginSource: LoginSource) {
  const login
    = typeof loginSource === "string"
      ? loginSource
      : loginSource.person.twitch.login;
  assert.ok(typeof login === "string" && isLowercase(login));
  return login;
}
