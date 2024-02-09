import { z } from "zod";
import { assert } from "~/utils/error";
import { toLowerCase } from "~/utils/string";

const paramSchema = z.string().transform(toLowerCase);

export default cachedEventHandler(
  async (event) => {
    const login = paramSchema.parse(getRouterParam(event, "login"));
    const apiUser = await fetchUser(login);
    return makeTwitchUser(apiUser);
  },
  { maxAge: 60 * 15 },
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

const twitchUserSchema = z.object({
  id: z.number(),
  login: z.string().transform(toLowerCase),
  nickname: z.string(),
  description: z.string(),
  avatarUrl: z.string(),
  createdAt: z.string(),
});

function makeTwitchUser(dataItem: ApiTwitchGetUsersResponse["data"][number]) {
  return twitchUserSchema.parse({
    id: Number(dataItem.id),
    login: toLowerCase(dataItem.login),
    nickname: dataItem.display_name,
    description: dataItem.description,
    avatarUrl: dataItem.profile_image_url,
    createdAt: dataItem.created_at,
  });
}

export type TwitchUser = ReturnType<typeof makeTwitchUser>;

export async function fetchUser(login: Lowercase<string>) {
  const { data } = await twitchApi.fetch<ApiTwitchGetUsersResponse>("/users", {
    query: { login },
  });
  assert.ok(
    data.length === 1,
    new Error("User with login=" + login + " not found"),
  );
  return data[0];
}
