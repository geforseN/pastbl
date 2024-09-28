import { twitchConfig } from "$/twitch/app.config";

export async function requireUserTwitchIdFromSession(event: H3Event) {
  const userSession = await requireUserSession(event);
  return userSession.user.twitch.id;
}

export type TwitchUserId = `${number}`;

export function isTwitchUserId(string: string): string is TwitchUserId {
  return (
    isStringifiedNumber(string)
    && string.length <= twitchConfig.twitchUser.id.length.max
  );
}
