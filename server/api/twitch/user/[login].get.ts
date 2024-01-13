import { z } from "zod";

const paramSchema = z.string();

export default cachedEventHandler(
  async (event) => {
    const login = paramSchema.parse(getRouterParam(event, "login"));
    const apiUser = await fetchUser(login);
    return makeUser(apiUser);
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

function makeUser(dataItem: ApiTwitchGetUsersResponse["data"][number]) {
  return {
    id: Number(dataItem.id),
    username: dataItem.login,
    nickname: dataItem.display_name,
    description: dataItem.description,
    avatarUrl: dataItem.profile_image_url,
    createdAt: dataItem.created_at,
  };
}

async function fetchUser(login: string) {
  const { data } = await twitch.api.fetch<ApiTwitchGetUsersResponse>("/users", {
    query: { login },
  });
  if (data.length !== 1) {
    throw new Error("User with username=" + login + " not found");
  }
  return data[0];
}
