import { getBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import {
  getFFZByUserTwitchNickname,
  getFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import {
  get7TVSetById,
  get7TVUserByTwitchId,
} from "~/integrations/SevenTV/SevenTV.api";
import { create7TVChannelSet } from "~/integrations/SevenTV/entity/create7TVChannelSet";

export type FFZ = ReturnType<typeof useAsyncEmotesState>["ffz"];
export type FFZRoom = ReturnType<typeof useAsyncEmotesState>["ffzRoom"];
export type BTTV = ReturnType<typeof useAsyncEmotesState>["bttv"];
export type SevenTV = ReturnType<typeof useAsyncEmotesState>["seventv"];
export type SevenTVSet = ReturnType<typeof useAsyncEmotesState>["seventvSet"];

export const useAsyncEmotesState = (userTwitchNickname: MaybeRef<string>) => {
  const ffz = useAsyncState(
    async () => {
      const ffz = await getFFZByUserTwitchNickname(toValue(userTwitchNickname));
      console.log({ ffz });
      return ffz;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const ffzRoom = useAsyncState(
    async (twitchId: number) => {
      const ffzRoom = await getFFZUserRoomByTwitchId(twitchId);
      console.log({ ffzRoom });
      return ffzRoom;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      const bttv = await getBetterTTVUserByTwitchId("uselessmouth");
      console.log({ bttv });
      return bttv;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      const seventv = await get7TVUserByTwitchId(twitchId);
      console.log({ seventv });
      return seventv;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const seventvSet = useAsyncState(
    async (emoteSetId: Nullish<string> = seventv.state.value?.emote_set.id) => {
      const sevenTVUserEmoteSet = seventv.state.value?.emote_set;
      if (Array.isArray(sevenTVUserEmoteSet?.emotes)) {
        console.log({
          seventvSet: sevenTVUserEmoteSet,
          // @ts-expect-error
          createdSet: create7TVChannelSet(sevenTVUserEmoteSet),
          isFastReturn: true,
        });
        // @ts-expect-error ? ts is stupid or what ? i checked in if statement that there is 'emotes' in set
        return create7TVChannelSet(sevenTVUserEmoteSet);
      }
      if (!emoteSetId) {
        throw new Error("Can not load 7TV emote set without 7TV set id");
      }
      const seventvSet = await get7TVSetById(emoteSetId);
      if (!Array.isArray(seventvSet?.emotes)) {
        throw new Error("Failed to load user emotes from SevenTV");
      }
      console.log({ seventvSet, isFastReturn: false });
      // @ts-expect-error
      return create7TVChannelSet(seventvSet);
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  function clearEveryState() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = undefined;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }
  const fetch = useAsyncState(
    async () => {
      clearEveryState();
      await ffz.execute().catch((error) => {
        if (ffz.state.value?.user?.twitch_id) {
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
          .then((userOf7TV) => seventvSet.execute(0, userOf7TV?.emote_set.id)),
      ]);
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    fetch,
  };
};
