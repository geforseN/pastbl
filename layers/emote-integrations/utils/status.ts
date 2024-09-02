function getEmotesIntegrationStatusAsEmoji(
  integration: TEmoteIntegrations.Settled,
) {
  switch (integration.status) {
    case "ready": {
      return "✅";
    }
    case "failed": {
      return "❌";
    }
    default: {
      raise();
    }
  }
}

export const emoteSourcesAsEmojis = new Map<EmoteSource, string>([
  ["FrankerFaceZ", "🐶"],
  ["BetterTTV", "🅱️"],
  ["SevenTV", "7️⃣"],
  ["Twitch", "🟣"],
]);

function getEmotesIntegrationSourceAsEmoji(
  integration: TEmoteIntegrations.Settled,
) {
  return emoteSourcesAsEmojis.get(integration.source) || raise();
}

export function getEmotesIntegrationsStatusAsEmojisString(
  integrations: TEmoteIntegrations.SettledRecord,
) {
  return Object.values(integrations)
    .map((integration) => {
      const emojiStatus = getEmotesIntegrationStatusAsEmoji(integration);
      const sourceEmoji = getEmotesIntegrationSourceAsEmoji(integration);
      return sourceEmoji + emojiStatus;
    })
    .join(", ");
}
