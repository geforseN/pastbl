import type { TwitchUser } from "./db/schema";

declare module "#auth-utils" {
  interface User {
    twitch: TwitchUser;
  }

  interface UserSession {}
}

export {};
