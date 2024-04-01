import type { H3Event, EventHandlerRequest } from "h3";

export type H3E = H3Event<EventHandlerRequest>;

export async function requireUserTwitchIdFromSession(event: H3E) {
  const userSession = await requireUserSession(event);
  return userSession.user.twitch.id;
}
