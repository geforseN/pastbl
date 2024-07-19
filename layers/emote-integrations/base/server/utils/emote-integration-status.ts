export function isIntegrationReady(integration) {
  return integration.status === "ready";
}

export function isIntegrationFailed(integration) {
  return integration.status === "failed";
}
