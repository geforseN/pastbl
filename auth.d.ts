import type { SessionUser } from "~~/server/utils/twitch/twitch-user";

declare module "#auth-utils" {
  interface User extends SessionUser {}

  interface UserSession {}
}

export {};
