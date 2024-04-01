import { groupBy } from "~/utils/object";

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
  isExact?: boolean;
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

function fetchChannels(query: string) {
  return twitchApi.fetch<ApiTwitchGetSearchChannelsResponse>(
    "/search/channels",
    {
      query: { query, first: 8 },
    },
  );
}

function makeChannel(
  apiChannel: ApiTwitchGetSearchChannelsResponse["data"][number],
) {
  return {
    id: apiChannel.id,
    login: apiChannel.broadcaster_login,
    nickname: apiChannel.display_name,
    thumbnailUrl: apiChannel.thumbnail_url,
    gameName: apiChannel.game_name,
    tags: apiChannel.tags,
    isLive: apiChannel.is_live,
    title: apiChannel.title,
    startedAt: apiChannel.started_at,
    isExact: false,
  } as Channel;
}

function getSortedChannels(
  channels: Channel[],
  login: Lowercase<string>,
): Channel[] {
  const groupedByIsLive = groupBy(channels, (channel) =>
    channel.isLive ? "live" : "notLive",
  );
  const { live = [], notLive = [] } = groupedByIsLive;
  const sorted = [...live, ...notLive];
  const exact = sorted.find((channel) => channel.login === login);
  if (exact) {
    sorted.splice(sorted.indexOf(exact), 1);
    sorted.unshift(exact);
    exact.isExact = true;
  }
  return sorted;
}

export async function getChannels(login: Lowercase<string>) {
  const apiChannels = await fetchChannels(login);
  const channels = apiChannels.data.map(makeChannel);
  const sortedChannels = getSortedChannels(channels, login);
  return sortedChannels;
}
