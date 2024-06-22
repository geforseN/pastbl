import { z } from "zod";
import type { TwitchApi } from "./twitch-api.types";
import { canBeTwitchUserLogin } from "./twitch-user-login";
import { canBeTwitchUserId } from "./twitch-user-id";

// LINK: https://dev.twitch.tv/docs/api/reference/#get-users
const twitchApiUserSchema = z.object({
  id: z.string().refine(canBeTwitchUserId),
  login: z.string().refine(canBeTwitchUserLogin),
  display_name: z.string(),
  // type: z.enum(["admin", "global_mod", "staff", ""]),
  // broadcaster_type: z.enum(["affiliate", "partner", ""]),
  description: z.string(),
  profile_image_url: z.string(),
  // offline_image_url: z.string(),
  // email: z.string().email().optional(),
  created_at: z.string(/* ____-__-__T__:__:__Z */).datetime(),
});

const twitchUserSchema = twitchApiUserSchema.transform((user) => ({
  id: user.id,
  login: user.login,
  nickname: user.display_name,
  description: user.description,
  avatarUrl: user.profile_image_url,
  createdAt: user.created_at,
}));

export type PersonTwitch = z.infer<typeof twitchUserSchema>;

const sessionUserSchema = twitchApiUserSchema.transform((user) => ({
  twitch: {
    id: user.id,
    login: user.login,
    avatarUrl: user.profile_image_url,
    nickname: user.display_name,
  },
}));

export type SessionUser = z.infer<typeof sessionUserSchema>;

function makeTwitchUser(apiTwitchUser: TwitchApi["getUser"]["responseItem"]) {
  return twitchUserSchema.parse(apiTwitchUser);
}

export async function getTwitchUser(login: TwitchUserLogin) {
  const apiUser = await fetchTwitchUser(login);
  return makeTwitchUser(apiUser);
}

export function makeSessionUser(user: unknown) {
  return sessionUserSchema.parse(user);
}
