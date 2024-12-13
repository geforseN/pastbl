import { inject, provide } from "vue";
import { assert } from "../../../app/utils/assert";
import type * as TEmoteIntegrations from "../shared/types";

const emoteIntegrationSymbol = Symbol("emoteIntegration");

export function provideEmoteIntegration(
  emoteIntegration: TEmoteIntegrations.__Some__,
) {
  provide(emoteIntegrationSymbol, emoteIntegration);
}

export function injectEmoteIntegration() {
  const emoteIntegration = inject<TEmoteIntegrations.__Some__>(
    emoteIntegrationSymbol,
  );
  assert.ok(emoteIntegration);
  return emoteIntegration;
}
