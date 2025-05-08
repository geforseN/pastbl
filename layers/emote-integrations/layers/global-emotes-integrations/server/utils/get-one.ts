import type { EmoteSource } from "../../../emote-sources/utils/external";

export async function getGlobalEmotesIntegration(source: EmoteSource) {
  return await globalEmotesIntegrations.of(source).get();
}
