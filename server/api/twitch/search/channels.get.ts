import { z } from "zod";
import { groupBy } from "~/utils/object";
import { toLowerCase } from "~/utils/string";

const querySchema = z.object({
  nickname: z.string(),
});

export default cachedEventHandler(
  async (event) => {
    const { nickname } = querySchema.parse(getQuery(event));
    const login = toLowerCase(nickname);
    const apiChannels = await fetchChannels(login);
    const channels = apiChannels.data.map(makeChannel);
    const sortedChannels = getSortedChannels(channels, login);
    return sortedChannels;
  },
  { maxAge: 60 * 2 },
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

export type Channel = {
  id: string;
  login: string;
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

export type ExtraChannel = Channel & { isExact?: true };

function fetchChannels(query: string) {
  return twitchApi.fetch<ApiTwitchGetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query, first: 8 },
    },
  );
}

function makeChannel(
  dataItem: ApiTwitchGetSearchChannelsResponse["data"][number],
) {
  return {
    id: dataItem.id,
    login: dataItem.broadcaster_login,
    nickname: dataItem.display_name,
    thumbnailUrl: dataItem.thumbnail_url,
    gameName: dataItem.game_name,
    tags: dataItem.tags,
    isLive: dataItem.is_live,
    title: dataItem.title,
    startedAt: dataItem.started_at,
  } as Channel;
}

function getSortedChannels(
  channels: Channel[],
  login: Lowercase<string>,
): ExtraChannel[] {
  const groupedByIsLive = groupBy(channels, (channel) =>
    channel.isLive ? "live" : "notLive",
  );
  const { live = [], notLive = [] } = groupedByIsLive;
  const sorted = [...live, ...notLive];
  const exact = sorted.find((channel) => channel.login === login);
  if (exact) {
    sorted.splice(sorted.indexOf(exact), 1);
    sorted.unshift(exact);
    (exact as ExtraChannel).isExact = true;
  }
  return sorted;
}
