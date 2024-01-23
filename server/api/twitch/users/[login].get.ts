import { z } from "zod";
import { toLowerCase } from "~/utils/string";

const paramSchema = z.string();

export default cachedEventHandler(
  async (event) => {
    const login = paramSchema.parse(getRouterParam(event, "login"));
    const apiUser = await fetchUser(login);
    return makeTwitchUser(apiUser);
  },
  { maxAge: 60 * 15 /* 15 minutes */ },
);

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

function makeTwitchUser(dataItem: ApiTwitchGetUsersResponse["data"][number]) {
  return {
    id: Number(dataItem.id),
    login: toLowerCase(dataItem.login),
    nickname: dataItem.display_name,
    description: dataItem.description,
    avatarUrl: dataItem.profile_image_url,
    createdAt: dataItem.created_at,
  };
}

export type TwitchUser = ReturnType<typeof makeTwitchUser>;

export async function fetchUser(login: string) {
  const { data } = await twitch.api.fetch<ApiTwitchGetUsersResponse>("/users", {
    query: { login },
  });
  if (data.length !== 1) {
    throw new Error("User with username=" + login + " not found");
  }
  return data[0];
}
