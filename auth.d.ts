import { UserTwitch } from "~/server/utils/twitch/twitch-user";

declare module "#auth-utils" {
  interface User extends UserTwitch {}

  interface UserSession {}
}

export {};
