export function useGlobalEmotesIntegrationsCheckedSources() {
  const checkedSources = useIndexedDBKeyValue(
    "global-emotes-integrations:checked-sources",
     [...allEmoteSources],
  );

  return {
    ...checkedSources,
    has(source: EmoteSource) {
      return checkedSources.state.value.includes(source);
    },
  };
}
