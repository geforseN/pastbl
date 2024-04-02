import { z } from "zod";
import type { TwitchApi } from "./twitch-api.types";
import { isLowercase } from "~/utils/string";

export type TwitchUser = ReturnType<typeof makeTwitchUser>;

const twitchUserSchema = z.object({
  id: z.string().refine((id): id is TwitchUserId => !Number.isNaN(Number(id))),
  login: z
    .string()
    .refine((login): login is TwitchUserLogin => isLowercase(login)),
  nickname: z.string(),
  description: z.string(),
  avatarUrl: z.string(),
  createdAt: z.string(),
});

function makeTwitchUser(apiTwitchUser: TwitchApi["getUser"]["responseItem"]) {
  return twitchUserSchema.parse({
    id: apiTwitchUser.id,
    login: apiTwitchUser.login,
    nickname: apiTwitchUser.display_name,
    description: apiTwitchUser.description,
    avatarUrl: apiTwitchUser.profile_image_url,
    createdAt: apiTwitchUser.created_at,
  });
}

export async function getTwitchUser(login: Lowercase<string>) {
  const apiUser = await fetchTwitchUser(login);
  return makeTwitchUser(apiUser);
}