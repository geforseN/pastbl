import type { SessionUser } from "./layers/twitch/twitch-user/server/utils/twitch-user";

declare module "#auth-utils" {
  type User = SessionUser;

  type UserSession = Record<string, never>;
}

export {};
