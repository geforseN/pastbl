import {
  personEmoteIntegrations,
  type PersonEmoteIntegrationRecord,
} from "./-record";

export async function getPersonEmoteIntegration<S extends EmoteSource>(
  source: S,
  personTwitch: PersonTwitch,
) {
  const integration = await personEmoteIntegrations
    .of(source)
    .get(personTwitch);
  return integration;
}

export function definePersonEmoteIntegrationEventHandler<S extends EmoteSource>(
  source: S,
) {
  const _integration = personEmoteIntegrations.of(
    source,
  ) as PersonEmoteIntegrationRecord[S];
  return async function (event: H3Event) {
    const login = getTwitchLoginRouteParam(event);
    const user = await getTwitchUser(login);
    const integration = (await _integration.get(user)) as ReturnType<
      PersonEmoteIntegrationRecord[S]["get"]
    >;
    return {
      integration,
    };
  };
}
