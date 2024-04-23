import type { IUserEmoteCollection } from "~/integrations";

export function useUsersCollectionsLoad(
  load: (login: TwitchUserLogin) => Promise<IUserEmoteCollection>,
  options: {
    beforeQueueRemove: (login: TwitchUserLogin) => MaybePromise<void>;
  },
) {
  const asyncQueue = ref(new Set<TwitchUserLogin>());

  return {
    async execute(login: TwitchUserLogin) {
      asyncQueue.value.add(login);
      const collection = await load(login);
      // FIXME: maybe move hook even more below (and remove it to 'beforeReturn')
      await options.beforeQueueRemove(login);
      asyncQueue.value.delete(login);
      return collection;
    },
    isCurrentlyLoading(login: TwitchUserLogin) {
      return asyncQueue.value.has(login);
    },
  };
}
