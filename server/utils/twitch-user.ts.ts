import { z } from "zod";
import { assert } from "~/utils/error";
import { toLowerCase } from "~/utils/string";

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
  id: z.string(),
  login: z
    .string()
    .refine(
      (login): login is Lowercase<string> => login === toLowerCase(login),
    ),
  nickname: z.string(),
  description: z.string(),
  avatarUrl: z.string(),
  createdAt: z.string(),
});

function makeTwitchUser(
  apiTwitchUser: ApiTwitchGetUsersResponse["data"][number],
) {
  return twitchUserSchema.parse({
    id: apiTwitchUser.id,
    login: apiTwitchUser.login,
    nickname: apiTwitchUser.display_name,
    description: apiTwitchUser.description,
    avatarUrl: apiTwitchUser.profile_image_url,
    createdAt: apiTwitchUser.created_at,
  });
}

async function fetchTwitchUser(login: Lowercase<string>) {
  const { data } = await twitchApi.fetch<ApiTwitchGetUsersResponse>("/users", {
    query: { login },
  });
  assert.ok(
    data.length === 1,
    new Error("User with login=" + login + " not found"),
  );
  return data[0];
}

export type TwitchUser = ReturnType<typeof makeTwitchUser>;

export const getTwitchUser = defineCachedFunction(
  async (login: Lowercase<string>) => {
    const apiUser = await fetchTwitchUser(login);
    return makeTwitchUser(apiUser);
  },
  { maxAge: 60 * 15 },
);
