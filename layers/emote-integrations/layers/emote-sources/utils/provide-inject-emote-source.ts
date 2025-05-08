import type * as TEmoteIntegrations from "../../../shared/types";
import { assert } from "../../../../../app/utils/assert";
import { allEmoteSources } from "./external";

const sourceSymbol = Symbol("source");

export function injectEmoteSource() {
  const source = inject(sourceSymbol);
  assert.ok(allEmoteSources.has(source));
  return source;
}

export function provideEmoteSource(integration: TEmoteIntegrations.__Some__) {
  provide(sourceSymbol, integration.source);
}
