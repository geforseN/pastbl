import { emoteSources, type EmoteSource } from "~/integrations/emote-source";

export function useGlobalIntegrationsCheckedSources() {
  const checkedSources = useIndexedDBKeyValue(
    "global-collections:checked-sources",
    emoteSources,
  );

  return {
    ...checkedSources,
    has(source: EmoteSource) {
      return checkedSources.state.value.includes(source);
    },
  };
}
