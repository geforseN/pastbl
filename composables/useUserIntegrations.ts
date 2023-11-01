import {
  create7TVUserChannelSet,
  createBTTVUserCollection,
  create7TVUserCollection,
  createFFZUserCollection,
  createFFZUserSets,
  createFFZPartialUserCollection,
} from "~/integrations";

import {
  getBetterTTVUserByTwitchId,
  get7TVSetById,
  get7TVUserProfileByTwitchId,
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
  UserNotFoundError,
} from "~/integrations/api";

import type { I7TVSet } from "~/integrations/SevenTV";
import type { I7TVUserCollection } from "~/integrations/SevenTV/entity/SevenTVUserCollection";

function useMyAsyncState<
  Data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params extends any[] = [],
  Shallow extends boolean = true,
>(promise: Promise<Data> | ((...args: Params) => Promise<Data>)) {
  return useAsyncState<Data | null, Params, Shallow>(promise, null, {
    immediate: false,
    throwError: true,
  });
}

function useUserService(/* TODO add arg serviceName: "FrankerFaceZ" | "7TV"| "BTTV" */) {
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

  return {
    isServiceHasUser,
    partialCollection,
    sets,
    fullCollection,
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

  return {
    isServiceHasUser,
    ...bttv,
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
        () => ({
          ...collectionState,
          sets: [activeSetState] satisfies [I7TVSet],
        }),
        { logKey: "7TV" },
      );
    },
  );

  return {
    isServiceHasUser,
    collection,
    activeSet,
    fullCollection,
  };
};

export type Use7TVReturn = ReturnType<typeof use7TVUser>;

export function useUserIntegrations(twitchNickname: MaybeRef<string>) {
  const ffz = useFFZUser();
  const bttv = useBTTVUser();
  const sevenTv = use7TVUser();

  const twitch = { id: ffz.partialCollection.state.value?.owner.twitchId };
  assert.ok(typeof twitch.id !== "number");

  function clearEveryState() {
    [
      ffz.partialCollection,
      ffz.sets,
      ffz.fullCollection,
      bttv,
      sevenTv.activeSet,
      sevenTv.collection,
      sevenTv.fullCollection,
    ].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = null;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }

  const integrations = useMyAsyncState(async () => {
    const username = toValue(twitchNickname).toLowerCase() as Lowercase<string>;
    clearEveryState();
    await ffz.partialCollection.execute(0, username).catch((error) => {
      if (ffz.partialCollection.state.value?.owner.twitchId) {
        return;
      }
      [bttv, sevenTv.collection].forEach((state) => {
        state.error.value = new Error(
          "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
        );
      });
      throw error;
    });
    const twitch = {
      id:
        ffz.partialCollection.state.value?.owner.twitchId ||
        raise("No twitch id found"),
      username,
    };
    await Promise.allSettled([
      ffz.sets.execute(0, twitch.id).then(() => ffz.fullCollection.execute()),
      bttv.execute(0, twitch),
      sevenTv.fullCollection.execute(0, twitch),
    ]);
    /* TODO: add return of full loaded collections 
    return {
      ffz,
      bttv,
      stv,
    };
    */
  });
  return {
    ffz,
    bttv,
    sevenTv,
    integrations,
  };
}
