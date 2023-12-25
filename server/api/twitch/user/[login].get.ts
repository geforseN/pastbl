import { twitchApiFetch } from "..";
import { storage, type TwitchToken } from "~/server/plugins/twitch-token";

type ApiTwitchGetUsersResponse = {
  data: {
    broadcaster_type: "affiliate" | "partner" | "";
    created_at: string /*  "____-__-__T__:__:__Z" */;
    description: string;
    display_name: string;
    id: `${number}`;
    login: string;
    offline_image_url: string;
    profile_image_url: string;
    type: "" | "admin" | "global_mod" | "staff";
    /** @deprecated */
    view_count?: number;
  }[];
};

export default defineEventHandler(async (event) => {
  const login = getRouterParam(event, "login");

  const twitchToken = await storage.getItem<TwitchToken>("twitchToken");

  const { data } = await twitchApiFetch<ApiTwitchGetUsersResponse>("/users", {
    query: { login },
    headers: {
      Authorization: `Bearer ${twitchToken?.access_token}`,
    },
  });
  if (data.length !== 1) {
    throw new Error("User with username=" + login + " not found");
  }
  const user = {
    id: Number(data[0].id),
    username: data[0].login,
    nickname: data[0].display_name,
    description: data[0].description,
    avatarUrl: data[0].profile_image_url,
    createdAt: data[0].created_at,
  };
  return user;
});
