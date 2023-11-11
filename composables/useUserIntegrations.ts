import {
  create7TVUserChannelSet,
  createBTTVUserCollection,
  create7TVUserCollection,
  createFFZUserCollection,
  createFFZUserSets,
  createFFZPartialUserCollection,
  type IEmoteCollection,
  type IUserEmoteCollection,
} from "~/integrations";

import {
  getBetterTTVUserByTwitchId,
  get7TVSetById,
  get7TVUserProfileByTwitchId,
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
  UserNotFoundError,
} from "~/integrations/api";

import { recreate7TVUserCollection } from "~/integrations/SevenTV/entity/recreate7TVUserCollection";
import { type I7TVUserCollection } from "~/integrations/SevenTV/entity/SevenTVUserCollection";

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

function useUserService() {
  /* TODO add arg serviceName: "FrankerFaceZ" | "7TV"| "BTTV" */
  const isServiceHasUser = ref<boolean | undefined>(undefined);

  function serviceErrorHandler(error: Error) {
    if (error instanceof UserNotFoundError) {
      isServiceHasUser.value = false;
      throw error;
    }
  }

  return {
    isServiceHasUser,
    serviceErrorHandler,
  };
}

const useFFZUser = () => {
  const { isServiceHasUser, serviceErrorHandler } = useUserService();

  const partialCollection = useMyAsyncState(
    async (username: Lowercase<string>) => {
      try {
        const profile = await getFFZProfileByTwitchUsername(username);
        isServiceHasUser.value = true;
        return withLog(() => createFFZPartialUserCollection(profile), {
          logKey: "FFZPartialCollection",
        });
      } catch (error) {
        assert.ok(error instanceof Error);
        serviceErrorHandler(error);
      }
    },
  );

  const sets = useMyAsyncState(async (twitchId: number) => {
    const room = await getFFZUserRoomByTwitchId(twitchId);
    return withLog(() => createFFZUserSets(room.sets), { logKey: "FFZSets" });
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
      () => createFFZUserCollection(ffzPartialCollection, ffzSets),
      {
        logKey: "FFZFullCollection",
      },
    );
  });
  function clearState() {
    for (const collection_ of [partialCollection, sets, fullCollection]) {
      collection_.state.value = null;
      collection_.error.value = null;
      collection_.isReady.value = false;
      collection_.isLoading.value = false;
    }
  }
  return {
    isServiceHasUser,
    partialCollection,
    sets,
    fullCollection,
    clearState,
  };
};
export type UseFFZReturn = ReturnType<typeof useFFZUser>;

const useBTTVUser = () => {
  const { isServiceHasUser, serviceErrorHandler } = useUserService();

  const bttv = useMyAsyncState(
    async (twitch: { id: number; username: Lowercase<string> }) => {
      try {
        const user = {
          ...(await getBetterTTVUserByTwitchId(twitch.id, twitch.username)),
          twitch: { username: twitch.username },
        };
        return withLog(() => createBTTVUserCollection(user), {
          logKey: "BTTV",
        });
      } catch (error) {
        assert.ok(error instanceof Error);
        serviceErrorHandler(error);
      }
    },
  );
  function clearState() {
    bttv.state.value = null;
    bttv.error.value = null;
    bttv.isReady.value = false;
    bttv.isLoading.value = false;
  }
  return {
    isServiceHasUser,
    ...bttv,
    clearState,
  };
};
export type UseBTTVReturn = ReturnType<typeof useBTTVUser>;

const use7TVUser = () => {
  const { isServiceHasUser, serviceErrorHandler } = useUserService();

  const collection = useMyAsyncState(
    async (twitch: { id: number; username?: Lowercase<string> }) => {
      try {
        const profile = await get7TVUserProfileByTwitchId(
          twitch.id,
          twitch.username,
        );
        isServiceHasUser.value = true;
        return withLog(() => create7TVUserCollection(profile), {
          logKey: "7TVCollection",
        });
      } catch (error) {
        assert.ok(error instanceof Error);
        serviceErrorHandler(error);
      }
    },
  );

  const activeSet = useMyAsyncState(
    async (collectionState: Readonly<I7TVUserCollection>) => {
      const { activeSet } = collectionState;
      if (activeSet.isValid) {
        return withLog(() => activeSet, {
          logKey: "7TVSet",
          additionalMessage: { isFastReturn: true },
        });
      }
      const apiSet = await get7TVSetById(activeSet.id);
      return withLog(() => create7TVUserChannelSet(apiSet), {
        logKey: "7TVSet",
        additionalMessage: { isFastReturn: false },
      });
    },
  );

  // FIXME: add full collection class as return value
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
        () => recreate7TVUserCollection(collectionState, [activeSetState]),
        { logKey: "7TV" },
      );
    },
  );

  function clearState() {
    for (const collection_ of [activeSet, collection, fullCollection]) {
      collection_.state.value = null;
      collection_.error.value = null;
      collection_.isReady.value = false;
      collection_.isLoading.value = false;
    }
  }

  return {
    isServiceHasUser,
    collection,
    activeSet,
    fullCollection,
    clearState,
  };
};

export type Use7TVReturn = ReturnType<typeof use7TVUser>;

export function useUserIntegrations() {
  const ffz = useFFZUser();
  const bttv = useBTTVUser();
  const sevenTv = use7TVUser();

  const integrations = useMyAsyncState(
    async (twitchNickname: MaybeRef<string>) => {
      const username = toValue(
        twitchNickname,
      ).toLowerCase() as Lowercase<string>;
      for (const integration of [ffz, bttv, sevenTv]) {
        integration.clearState();
      }
      await ffz.partialCollection.execute(0, username).catch((error) => {
        for (const state of [bttv, sevenTv.collection]) {
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
      const settledCollections = await Promise.allSettled<IEmoteCollection>([
        ffz.sets
          .execute(0, twitchUser.id)
          .then(() => ffz.fullCollection.execute())
          .then((v) => v || raise("No FrankerFaceZ collection found")),
        bttv
          .execute(0, twitchUser)
          .then((v) => v || raise("No BetterTTV collection found")),
        sevenTv.fullCollection
          .execute(0, twitchUser)
          .then((v) => v || raise("No SevenTV collection found")),
      ]);

      const [fulfilledCollections, rejectReasons] =
        tupleSettledPromises(settledCollections);
      const collections = arrayToRecordByValueOfKey(
        fulfilledCollections,
        "source",
      );
      assert.ok(
        rejectReasons.every(
          (reason): reason is UserNotFoundError =>
            reason instanceof UserNotFoundError,
        ),
      );
      const failedCollectionsReasons = rejectReasons.reduce(
        (reasonRecord, notFoundError) => {
          reasonRecord[notFoundError.source] = notFoundError.message;
          return reasonRecord;
        },
        {} as
          | Record<"BetterTTV" | "SevenTV" | "FrankerFaceZ", string>
          | Record<string, never>,
      );
      /* eslint-disable no-console */
      process.dev &&
        console.log({
          settledCollections,
          fulfilledCollections,
          rejectReasons,
          failedCollectionsReasons,
          collections,
          twitchUser,
        });
      return {
        twitch: {
          ...twitchUser,
        },
        failedCollectionsReasons,
        updatedAt: Date.now(),
        collections,
        isActive: false,
      } as IUserEmoteCollection;
    },
  );

  return {
    ffz,
    bttv,
    sevenTv,
    integrations,
  };
}
