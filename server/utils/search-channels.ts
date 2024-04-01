import { groupBy } from "~/utils/object";

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
