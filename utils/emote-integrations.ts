import type { EmoteSource, IUserEmoteCollection } from "~/integrations";

const sourceMap = new Map<EmoteSource, string>([
  ["FrankerFaceZ", "🐶"],
  ["BetterTTV", "🅱️"],
  ["SevenTV", "7️⃣"],
  ["Twitch", "🟣"],
]);

export function getEmoteIntegrationsStatus(collection: IUserEmoteCollection) {
  return Object.values(collection.integrations)
    .map((integration) => {
      const emojiStatus = integration.status === "ready" ? "✅" : "❌";
      return sourceMap.get(integration.source) + emojiStatus;
    })
    .join(", ");
}
