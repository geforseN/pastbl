

const sourceSymbol = Symbol("source");

export function injectEmoteSource() {
  const source = inject(sourceSymbol);
  assert.ok(allEmoteSources.has(source));
  return source;
}

export function provideEmoteSource(integration: TEmoteIntegrations.__Some__) {
  provide(sourceSymbol, integration.source);
}
