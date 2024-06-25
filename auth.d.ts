import type { SessionUser } from "~~/server/utils/twitch-user";

declare module "#auth-utils" {
  interface User extends SessionUser {}

  interface UserSession {}
}

export {};
