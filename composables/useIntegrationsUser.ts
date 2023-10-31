import { create7TVUserChannelSet } from "~/integrations";
import type { I7TVSet } from "~/integrations/SevenTV";
import {
  get7TVSetById,
  get7TVUserProfileByTwitchId,
} from "~/integrations/SevenTV/SevenTV.api";
import { SevenTVUserNotFoundError } from "~/integrations/SevenTV/UserNotFoundError";
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

export const use7TVUser = (twitchId: number, nickname?: string) => {
  const isUserExist = ref<boolean | undefined>(undefined);
  const _rawUserProfile = ref();

  const collection = useMyAsyncState(
    async (twitchId: number, nickname?: string) => {
      try {
        const profile = await get7TVUserProfileByTwitchId(twitchId, nickname);
        _rawUserProfile.value = profile;
        isUserExist.value = true;
        return withLog(() => create7TVUserCollection2(profile), {
          logKey: "7TVCollection",
        });
      } catch (error) {
        assert.ok(error instanceof Error);
        if (error instanceof SevenTVUserNotFoundError) {
          isUserExist.value = false;
          throw error;
        }
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

  const fullCollection = useMyAsyncState(async () => {
    const collectionState = await collection.execute(0, twitchId, nickname);
    assert.ok(
      collectionState,
      "Can not get full collection without collection",
    );
    const activeSetState = await activeSet.execute(0, collectionState);
    assert.ok(activeSetState, "Can not get full collection without active set");
    return withLog(
      () => ({
        ...collectionState,
        sets: [activeSetState] satisfies [I7TVSet],
      }),
      { logKey: "7TV" },
    );
  });

  return {
    isUserExist,
    fullCollection,
    collection,
    activeSet,
    _rawUserProfile,
  };
};
