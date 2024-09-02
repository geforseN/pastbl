

export function isEmotesIntegrationReady(
  integration: TEmoteIntegrations.Global.Settled,
): integration is TEmoteIntegrations.Global.Ready;
export function isEmotesIntegrationReady(
  integration: TEmoteIntegrations.Person.Settled,
): integration is TEmoteIntegrations.Person.Ready;
export function isEmotesIntegrationReady(
  integration: TEmoteIntegrations.Settled,
) {
  return integration.status === "ready";
}

export function isEmotesIntegrationFailed(
  integration: TEmoteIntegrations.Global.Settled,
): integration is TEmoteIntegrations.Global.Failed;
export function isEmotesIntegrationFailed(
  integration: TEmoteIntegrations.Person.Settled,
): integration is TEmoteIntegrations.Person.Failed;
export function isEmotesIntegrationFailed(
  integration: TEmoteIntegrations.Settled,
) {
  return integration.status === "failed";
}
