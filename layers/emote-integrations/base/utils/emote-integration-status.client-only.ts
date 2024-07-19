export function isIntegrationRefreshing(integration) {
  return integration.status === "refreshing";
}

export function isIntegrationLoading(integration) {
  return integration.status === "loading";
}
