import { UserTwitch } from "./server/api/auth/twitch.get";

declare module "#auth-utils" {
  interface User extends UserTwitch {}

  interface UserSession {}
}

export {};
