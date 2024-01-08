import type { UseAsyncStateReturn } from "@vueuse/core";
import {
  create7TVUserChannelSet,
  createBTTVUserIntegration,
  create7TVUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
  createFFZPartialUserIntegration,
  recreate7TVUserIntegration,
  type IUserEmoteCollection,
  type I7TVUserCollection,
  type IUserEmoteIntegration,
} from "~/integrations";

import {
  getBetterTTVUserByTwitchId,
  get7TVSetById,
  get7TVUserProfileByTwitchId,
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
} from "~/integrations/api";

function useMyAsyncState<
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
  ...states: UseAsyncStateReturn<unknown, any[], boolean>[]
) {
  return () => {
    for (const state of states) {
      state.state.value = null;
      state.error.value = null;
      state.isReady.value = false;
      state.isLoading.value = false;
    }
  };
}

const useFFZUser = () => {
  const partialCollection = useMyAsyncState(
    async (username: Lowercase<string>) => {
      const profile = await getFFZProfileByTwitchUsername(username);
      return withLog(
        createFFZPartialUserIntegration(profile),
        "FFZPartialCollection",
      );
    },
  );

  const sets = useMyAsyncState(async (twitchId: number) => {
    const room = await getFFZUserRoomByTwitchId(twitchId);
    return withLog(createFFZUserSets(room.sets), "FFZSets");
  });

  const fullCollection = useMyAsyncState(() => {
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
    clear: makeClearAsyncState(partialCollection, sets, fullCollection),
  };
};
export type UseFFZReturn = ReturnType<typeof useFFZUser>;

const useBTTVUser = () => {
  const bttv = useMyAsyncState(
    async (twitch: { id: number; username: Lowercase<string> }) => {
      const user = {
        ...(await getBetterTTVUserByTwitchId(twitch.id, twitch.username)),
        twitch: { username: twitch.username },
      };
      return withLog(createBTTVUserIntegration(user), "BTTV");
    },
  );

  return {
    ...bttv,
    clear: makeClearAsyncState(bttv),
  };
};

export type UseBTTVReturn = ReturnType<typeof useBTTVUser>;

const use7TVUser = () => {
  const collection = useMyAsyncState(
    async (twitch: { id: number; username?: Lowercase<string> }) => {
      const profile = await get7TVUserProfileByTwitchId(
        twitch.id,
        twitch.username,
      );
      return withLog(create7TVUserIntegration(profile), "7TVCollection");
    },
  );

  const activeSet = useMyAsyncState(
    async (collectionState: Readonly<I7TVUserCollection>) => {
      const { activeSet } = collectionState;
      if (activeSet.isValid) {
        return withLog(activeSet, {
          logKey: "7TVSet",
          additionalMessages: { isFastReturn: true },
        });
      }
      const apiSet = await get7TVSetById(activeSet.id);
      return withLog(create7TVUserChannelSet(apiSet), {
        logKey: "7TVSet",
        additionalMessages: { isFastReturn: false },
      });
    },
  );

  const fullCollection = useMyAsyncState(
    async (twitch: { id: number; username?: Lowercase<string> }) => {
      const collectionState = await collection.execute(0, twitch);
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
    clear: makeClearAsyncState(collection, activeSet, fullCollection),
  };
};

export type Use7TVReturn = ReturnType<typeof use7TVUser>;

export function useUserIntegrations() {
  const ffz = useFFZUser();
  const bttv = useBTTVUser();
  const sevenTv = use7TVUser();

  const collection = useMyAsyncState(
    async (twitchNickname: MaybeRef<string>) => {
      const username = toLowerCase(toValue(twitchNickname));
      for (const integration of [ffz, bttv, sevenTv]) {
        integration.clear();
      }
      await ffz.partialCollection.execute(0, username).catch((error) => {
        for (const state of [bttv, sevenTv.fullCollection]) {
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
        username,
        nickname:
          ffz.partialCollection.state.value?.owner.displayName ||
          raise("No twitch nickname found"),
      };
      const integrationPromises = [
        ffz.sets
          .execute(0, twitchUser.id)
          .then(() => ffz.fullCollection.execute(0))
          .then(withOkAssert("No FrankerFaceZ integration found")),
        bttv.execute(0, twitchUser),
        sevenTv.fullCollection
          .execute(0, twitchUser)
          .then(withOkAssert("No SevenTV integration found")),
      ] as const;
      const [fulfilledIntegrations, rejectReasons] =
        await tupleSettledPromises<IUserEmoteIntegration>(integrationPromises);
      const integrations = groupBy(
        fulfilledIntegrations,
        (collection) => collection.source,
      );
      const failedIntegrationsReasons = groupBy(
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
