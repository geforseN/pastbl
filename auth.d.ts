import type { SessionUser } from "./layers/twitch/twitch-user/server/utils/twitch-user";

declare module "#auth-utils" {
  // NOTE: must use interface, otherwise generated types are wrong
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface User extends SessionUser {}

  interface UserSession extends Record<string, never> {}
  /* eslint-enable @typescript-eslint/no-empty-object-type */
}

export {};
