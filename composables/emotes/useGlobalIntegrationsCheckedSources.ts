import { emoteSources, type EmoteSource } from "~/integrations";

export function useGlobalIntegrationsCheckedSources() {
  const checkedSources = useIndexedDBKeyValue(
    "global-collections:checked-sources",
    [...emoteSources],
  );

  return {
    ...checkedSources,
    has(source: EmoteSource) {
      return checkedSources.state.value.includes(source);
    },
  };
}
