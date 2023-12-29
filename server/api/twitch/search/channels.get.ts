import { z } from "zod";

const querySchema = z.object({
  query: z.string(),
});

export default cachedEventHandler(
  async (event) => {
    const { query } = querySchema.parse(getQuery(event));
    const accessToken = await twitch.getAccessToken();
    const apiChannels = await fetchChannels(query, accessToken);
    return apiChannels.data.map(makeChannel);
  },
  { maxAge: 60 * 2 /* 2 minutes */ },
);

type ApiTwitchGetSearchChannelsResponse = {
  data: {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    /** @deprecated, now it's always an empty array, use tags instead */
    tag_ids: string[];
    tags: string[];
    thumbnail_url: string;
    title: string;
    started_at: string;
  }[];
};

function fetchChannels(query: string, accessToken: string) {
  return twitch.api.fetch<ApiTwitchGetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query, first: 12 },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

type Channel = {
  id: string;
  username: string;
  nickname: string;
  thumbnailUrl: string;
  gameName: string;
  tags: string[];
} & (
  | {
      isLive: true;
      title: string;
      startedAt: string;
    }
  | {
      isLive: false;
      title: "";
      startedAt: "";
    }
);

function makeChannel(
  dataItem: ApiTwitchGetSearchChannelsResponse["data"][number],
) {
  return {
    id: dataItem.id,
    username: dataItem.broadcaster_login,
    nickname: dataItem.display_name,
    thumbnailUrl: dataItem.thumbnail_url,
    gameName: dataItem.game_name,
    tags: dataItem.tags,
    isLive: dataItem.is_live,
    title: dataItem.title,
    startedAt: dataItem.started_at,
  } as Channel;
}
