import { create7TVUserChannelSet } from "~/integrations";
import { UserNotFoundError } from "~/integrations/UserNotFoundError";
import {
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import { getBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import { createBTTVUserCollection2 } from "~/integrations/BetterTTV/entity/createBTTVUserCollection";

import { createFFZPartialUserCollection } from "~/integrations/FrankerFaceZ/entity/createFFZPartialUserCollection";
import { createFFZUserCollection2 } from "~/integrations/FrankerFaceZ/entity/createFFZUserCollection";
import { createFFZUserSets } from "~/integrations/FrankerFaceZ/entity/createFFZUserSets";
import {
  get7TVSetById,
  get7TVUserProfileByTwitchId,
} from "~/integrations/SevenTV/SevenTV.api";
import type { I7TVSet } from "~/integrations/SevenTV";
import type { I7TVUserCollection } from "~/integrations/SevenTV/entity/SevenTVUserCollection";
import { create7TVUserCollection2 } from "~/integrations/SevenTV/entity/create7TVUserCollection";

function useMyAsyncState<
  Data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params extends any[] = [],
  Shallow extends boolean = true,
>(promise: Promise<Data> | ((..._args: Params) => Promise<Data>)) {
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
      () => createFFZUserCollection2(ffzPartialCollection, ffzSets),
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

const useBTTVUser = () => {
  const { isServiceHasUser, serviceErrorHandler } = useUserService();

  const bttv = useMyAsyncState(
    async (twitch: { id: number; username: Lowercase<string> }) => {
      try {
        const user = {
          ...(await getBetterTTVUserByTwitchId(twitch.id, twitch.username)),
          twitch: { username: twitch.username },
        };
        return withLog(() => createBTTVUserCollection2(user), {
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
    bttv,
  };
};

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
        return withLog(() => create7TVUserCollection2(profile), {
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

export function useUserIntegrations(twitchNickname: MaybeRef<string>) {
  const username = toValue(twitchNickname).toLowerCase() as Lowercase<string>;

  const ffz = useFFZUser();
  const bttv = useBTTVUser();
  const stv = use7TVUser();

  const twitch = { id: ffz.partialCollection.state.value?.owner.twitchId };
  assert.ok(typeof twitch.id !== "number");

  function clearEveryState() {
    [
      ffz.partialCollection,
      ffz.sets,
      ffz.fullCollection,
      bttv.bttv,
      stv.activeSet,
      stv.collection,
      stv.fullCollection,
    ].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = null;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }

  const integrations = useMyAsyncState(async () => {
    clearEveryState();
    await ffz.partialCollection.execute(0, username).catch((error) => {
      if (ffz.partialCollection.state.value?.owner.twitchId) {
        return;
      }
      [bttv.bttv, stv.collection].forEach((state) => {
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
      bttv.bttv.execute(0, twitch),
      stv.fullCollection.execute(0, twitch),
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
    stv,
    integrations,
  };
}
