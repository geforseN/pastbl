export async function getPersonEmoteCollection(login: TwitchUserLogin) {
  const twitchUser = await getTwitchUser(login);
  const integrations = await getPersonAllEmoteIntegrations(twitchUser);
  return <IPersonEmoteCollection>{
    person: {
      twitch: twitchUser,
    },
    integrations,
    formedAt: Date.now(),
  };
}
