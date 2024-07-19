export function usePersonsCollectionsLoad(
  load: (login: TwitchUserLogin) => Promise<IUserEmoteCollection>,
) {
  const asyncQueue = ref(new Set<TwitchUserLogin>());

  return {
    async execute(login: TwitchUserLogin) {
      asyncQueue.value.add(login);
      const collection = await load(login);
      asyncQueue.value.delete(login);
      return collection;
    },
    isCurrentlyLoading(login: TwitchUserLogin) {
      return asyncQueue.value.has(login);
    },
  };
}
