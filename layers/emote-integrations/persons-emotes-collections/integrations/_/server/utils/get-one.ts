import { personEmoteIntegrations } from "./-record";

export async function getPersonEmoteIntegration<S extends EmoteSource>(
  source: S,
  personTwitch: PersonTwitch,
) {
  const integration = await personEmoteIntegrations
    .of(source)
    .get(personTwitch);
  return integration;
}

export function definePersonEmoteIntegrationEventHandler(source: EmoteSource) {
  const _integration = personEmoteIntegrations.of(source);
  return async function (event: H3Event) {
    const login = getTwitchLoginRouteParam(event);
    const user = await getTwitchUser(login);
    const integration = await _integration.get(user);
    return {
      integration,
    };
  };
}
