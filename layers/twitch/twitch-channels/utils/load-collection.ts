export function usePersonEmotesCollectionLoad(
  nicknameInput: Ref<string>,
  options: {
    mustSelectCollectionAfterLoad: MaybeRef<boolean>;
    mustClearNicknameInputBeforeLoad: MaybeRef<boolean>;
  },
) {
  const toast = usePersonEmotesCollectionLoadToasts();
  const personsEmotesCollectionsStore = usePersonsEmoteCollectionsStore();

  return useAsyncObject(
    async () => {
      const nickname = nicknameInput.value;
      assert.ok(nickname.length, () => toast.panic("emptyInput"));
      const login = toLowerCase(nickname);
      const collection =
        await personsEmotesCollectionsStore.loadCollection(login);
      toast.success(
        nickname,
        getEmotesIntegrationsStatusAsEmojisString(collection.integrations),
      );
      if (toValue(options.mustSelectCollectionAfterLoad)) {
        personsEmotesCollectionsStore.selectCollection(login);
      }
      return collection;
    },
    { immediate: false },
  );
}
