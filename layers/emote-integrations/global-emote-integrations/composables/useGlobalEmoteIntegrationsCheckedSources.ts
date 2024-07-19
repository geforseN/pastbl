export function useGlobalEmoteIntegrationsCheckedSources() {
  const checkedSources = useIndexedDBKeyValue(
    "global-emote-integrations:checked-sources",
     allEmoteSources.values,
  );

  return {
    ...checkedSources,
    has(source: EmoteSource) {
      return checkedSources.state.value.includes(source);
    },
  };
}
