export async function requireUserTwitchIdFromSession(event: H3E) {
  const userSession = await requireUserSession(event);
  return userSession.user.twitch.id;
}

export type TwitchUserId = `${number}`;

export function isTwitchUserId(string: string): string is TwitchUserId {
  return !Number.isNaN(Number(string));
}
