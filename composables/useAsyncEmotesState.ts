import { getBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import {
  getFFZByUserTwitchNickname,
  getFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import {
  get7TVSetById,
  get7TVUserProfileByTwitchId,
  type SevenTVApiUserProfile,
} from "~/integrations/SevenTV/SevenTV.api";
import {
  create7TVUserChannelSet,
  create7TVUserCollection,
  createBTTVUserCollection,
  createFFZUserCollection,
} from "~/integrations";

const asyncStateArgs = [
  null,
  {
    immediate: false,
    throwError: true,
  },
] as const;

export const useAsyncEmotesState = (userTwitchNickname: MaybeRef<string>) => {
  const ffz = useAsyncState(
    async () => {
      return withLog(
        () => getFFZByUserTwitchNickname(toValue(userTwitchNickname)),
        {
          logKey: "ffz",
        },
      );
    },
    ...asyncStateArgs,
  );

  const ffzRoom = useAsyncState(
    async (twitchId: number) => {
      return withLog(() => getFFZUserRoomByTwitchId(twitchId), {
        logKey: "ffzRoom",
      });
    },
    ...asyncStateArgs,
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      return withLog(() => getBetterTTVUserByTwitchId(twitchId), {
        logKey: "bttv",
      });
    },
    ...asyncStateArgs,
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      return withLog(() => get7TVUserProfileByTwitchId(twitchId), {
        logKey: "seventv",
      });
    },
    ...asyncStateArgs,
  );

  const seventvSet = useAsyncState(
    async (sevenTvUser: SevenTVApiUserProfile) => {
      console.log(sevenTvUser);
      if (Array.isArray(sevenTvUser.emote_set.emotes)) {
        console.log({
          seventvSet: sevenTvUser.emote_set,
          // @ts-expect-error
          createdSet: create7TVUserChannelSet(sevenTvUser.emote_set),
          isFastReturn: true,
        });
        // @ts-expect-error
        return create7TVUserChannelSet(sevenTvUser.emote_set);
      }
      if (!sevenTvUser.emote_set.id) {
        throw new Error("Can not load 7TV emote set without 7TV set id");
      }
      const seventvSet = await get7TVSetById(sevenTvUser.emote_set.id);
      console.log({ seventvSet, isFastReturn: false });
      return create7TVUserChannelSet(seventvSet);
    },
    ...asyncStateArgs,
  );

  function clearEveryState() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = null;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }
  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    fetch: useAsyncState(
      async () => {
        clearEveryState();
        await ffz.execute().catch((error) => {
          if (ffz.state.value?.user.twitch_id) {
            return;
          }
          [bttv, seventv].forEach((state) => {
            state.error.value = new Error(
              "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
            );
          });
          throw error;
        });
        const twitchId = ffz.state.value!.user.twitch_id!;
        await Promise.allSettled([
          ffzRoom.execute(0, twitchId),
          bttv.execute(0, twitchId),
          seventv
            .execute(0, twitchId)
            .then((sevenTvUser) =>
              seventvSet.execute(0, sevenTvUser || raise("No 7TV user found")),
            ),
        ]);
        const ffzCollection = await createFFZUserCollection(
          ffz.state.value || raise("No ffz"),
          ffzRoom.state.value || raise("No ffz room"),
        );
        return {
          ffzCollection,
          bttvCollection: await createBTTVUserCollection(
            bttv.state.value || raise("No bttv"),
            ffzCollection.owner.displayName,
          ),
          seventTvCollection: await create7TVUserCollection(
            seventv.state.value || raise("No seventv"),
            seventvSet.state.value || raise("No seventv set"),
          ),
        };
      },
      ...asyncStateArgs,
    ),
  };
};

async function withLog<T>(
  cb: () => T | Promise<T>,
  { logKey }: { logKey: string },
): Promise<T> {
  const returnvalue = await cb();
  console.log({ [logKey]: returnvalue });
  return returnvalue;
}
