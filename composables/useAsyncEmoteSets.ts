import { fetchBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import { sevenTVApi } from "~/integrations/SevenTV/SevenTV.api";
import {
  fetchFFZByUserTwitchNickname,
  fetchFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

export default function useAsyncEmoteSets(
  userTwitchNickname: MaybeRef<string>,
) {
  const ffz = useAsyncState(
    async () => {
      const a = await fetchFFZByUserTwitchNickname(toValue(userTwitchNickname));
      console.log(a);
      return a;
    },
    null,
    {
      immediate: false,
    },
  );
  const ffzRoom = useAsyncState(
    async (twitchId: number) => {
      const a = await fetchFFZUserRoomByTwitchId(twitchId);
      console.log(a);
      return a;
    },
    null,
    {
      immediate: false,
    },
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      const a = await fetchBetterTTVUserByTwitchId(twitchId);
      console.log(1, a);
      return a;
    },
    null,
    { immediate: false },
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      const a = await sevenTVApi.fetchUserByTwitchId(twitchId);
      console.log(2, a);
      return a;
    },
    null,
    { immediate: false },
  );

  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    doMagic: async () => {
      await ffz.execute();
      const twitchId = ffz.state.value?.user?.twitch_id;
      if (!twitchId) {
        // TODO add ref with this error which will be shown to user (or add toast)
        throw new Error(
          "Can not perform emote collections without user twitch id",
        );
      }
      // TODO use Promise.allSettled instead
      await Promise.all([
        ffzRoom.execute(0, twitchId),
        bttv.execute(0, twitchId),
        seventv.execute(0, twitchId),
      ]);
    },
  };
}
