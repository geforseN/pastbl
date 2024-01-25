import type { UseAsyncStateReturn } from "@vueuse/core";
import {
  BetterTTV,
  createFFZUserIntegration,
  recreate7TVUserIntegration,
  type IUserEmoteCollection,
  type IUserEmoteIntegration,
  FrankerFaceZ,
  SevenTV,
} from "~/integrations";

function useMyLazyAsyncState<
  Data,
  Params extends unknown[] = [],
  Shallow extends boolean = true,
>(promise: Promise<Data> | ((...args: Params) => Promise<Data>)) {
  return useAsyncState<Data | null, Params, Shallow>(promise, null, {
    immediate: false,
    throwError: true,
  });
}

function makeClearAsyncState(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...asyncStates: UseAsyncStateReturn<unknown, any[], boolean>[]
) {
  return () => {
    for (const asyncState of asyncStates) {
      asyncState.state.value = null;
      asyncState.error.value = null;
      asyncState.isReady.value = false;
      asyncState.isLoading.value = false;
    }
  };
}

const useFFZUser = () => {
  const partialCollection = useMyLazyAsyncState(
    FrankerFaceZ.userIntegration.givePartial,
  );

  const sets = useMyLazyAsyncState(FrankerFaceZ.userIntegration.giveSets);

  const fullCollection = useMyLazyAsyncState(() => {
    const ffzPartialCollection = partialCollection.state.value;
    assert.ok(
      ffzPartialCollection,
      "Can not get full collection without partial",
    );
    const ffzSets = sets.state.value;
    assert.ok(ffzSets, "Can not get full collection without sets");
    return withLog(
      createFFZUserIntegration(ffzPartialCollection, ffzSets),
      "FFZFullCollection",
    );
  });

  return {
    partialCollection,
    sets,
    fullCollection,
    ...fullCollection,
    clear: makeClearAsyncState(partialCollection, sets, fullCollection),
  };
};
export type UseFFZReturn = ReturnType<typeof useFFZUser>;

const useBTTVUser = () => {
  const bttv = useMyLazyAsyncState(BetterTTV.giveUserIntegration);

  return {
    ...bttv,
    clear: makeClearAsyncState(bttv),
  };
};

export type UseBTTVReturn = ReturnType<typeof useBTTVUser>;

const use7TVUser = () => {
  const collection = useMyLazyAsyncState(SevenTV.giveUserIntegration);

  const activeSet = useMyLazyAsyncState(SevenTV.giveActiveSet);

  const fullCollection = useMyLazyAsyncState(
    async (twitchId: number, twitchUsername?: Lowercase<string>) => {
      const collectionState = await collection.execute(
        0,
        twitchId,
        twitchUsername,
      );
      assert.ok(
        collectionState,
        "Can not get full collection without collection",
      );
      const activeSetState = await activeSet.execute(0, collectionState);
      assert.ok(
        activeSetState,
        "Can not get full collection without active set",
      );
      return withLog(
        recreate7TVUserIntegration(collectionState, [activeSetState]),
        "7TV",
      );
    },
  );

  return {
    collection,
    activeSet,
    fullCollection,
    ...fullCollection,
    clear: makeClearAsyncState(collection, activeSet, fullCollection),
  };
};

export type Use7TVReturn = ReturnType<typeof use7TVUser>;

// TODO: rename to useAsyncUserCollection
export function useUserIntegrations() {
  const ffz = useFFZUser();
  const bttv = useBTTVUser();
  const sevenTv = use7TVUser();

  const isTwitchIdLoaded = () =>
    ffz.partialCollection.isReady.value && !ffz.partialCollection.error.value;

  const collection = useMyLazyAsyncState(
    async (twitchNickname: MaybeRef<string>) => {
      const login = toLowerCase(toValue(twitchNickname));
      for (const integration of [ffz, bttv, sevenTv]) {
        integration.clear();
      }
      await ffz.partialCollection
        .execute(0, login)
        .then(withOkAssert("No FrankerFaceZ integration found"))
        .catch((error) => {
          for (const state of [bttv, sevenTv]) {
            state.error.value = new Error(
              "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
            );
          }
          throw error;
        });
      const twitchUser = {
        id:
          ffz.partialCollection.state.value?.owner.twitchId ||
          raise("No twitch id found"),
        username: login,
        nickname:
          ffz.partialCollection.state.value?.owner.displayName ||
          raise("No twitch nickname found"),
      };
      // await until(isTwitchIdLoaded).toBeTruthy({
      //   timeout: 10_000,
      //   throwOnTimeout: true,
      // });
      const integrationPromises = [
        ffz.sets
          .execute(0, twitchUser.id)
          .then(() => ffz.fullCollection.execute(0))
          .then(withOkAssert("No FrankerFaceZ integration found")),
        bttv.execute(0, twitchUser.id, twitchUser.username),
        sevenTv
          .execute(0, twitchUser.id, twitchUser.username)
          .then(withOkAssert("No SevenTV integration found")),
      ] as const;
      const [fulfilledIntegrations, rejectReasons] =
        await tupleSettledPromises<IUserEmoteIntegration>(integrationPromises);
      const integrations = flatGroupBy(
        fulfilledIntegrations,
        (collection) => collection.source,
      );
      const failedIntegrationsReasons = flatGroupBy(
        rejectReasons,
        // @ts-expect-error for minimal code TypeScript check can be omitted
        (reason, index) => reason?.source ?? index,
      );
      withLogSync(
        {
          fulfilledIntegrations,
          rejectReasons,
          failedIntegrationsReasons,
          integrations,
          twitchUser,
        },
        "UserIntegrations",
      );
      return {
        twitch: {
          ...twitchUser,
        },
        failedIntegrationsReasons,
        updatedAt: Date.now(),
        integrations,
      } as IUserEmoteCollection;
    },
  );

  return {
    ffz,
    bttv,
    sevenTv,
    collection,
  };
}
