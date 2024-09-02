import type { SessionUser } from "./layers/twitch/twitch-user/server/utils/twitch-user";

declare module "#auth-utils" {
  interface User extends SessionUser {}

  interface UserSession extends Record<string, never> {}
}

export {};
