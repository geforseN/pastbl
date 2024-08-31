import type { TwitchApi } from "#integrations_twitch/api-types";

export async function fetchTwitchUser(login: TwitchUserLogin) {
  const { data } = await fetchTwitchApi<TwitchApi.GetUsersResponse>("/users", {
    query: { login },
  });
  assert.ok(
    data.length === 1,
    new Error(`Received ${data.length} users, expected 1`),
  );
  const user = data[0];
  assert.ok(user, new Error(`User with login ${login} not found`));
  return user;
}
