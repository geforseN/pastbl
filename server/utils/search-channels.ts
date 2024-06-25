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

function makeChannel(channel: ITwitch.API.SearchChannel) {
  return {
    id: channel.id,
    login: channel.broadcaster_login,
    nickname: channel.display_name,
    thumbnailUrl: channel.thumbnail_url,
    gameName: channel.game_name,
    tags: channel.tags,
    isLive: channel.is_live,
    title: channel.title,
    startedAt: channel.started_at,
    isExact: false,
  } as Channel;
}

function getSortedChannels(
  channels: Channel[],
  login: TwitchUserLogin,
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

export async function getTwitchChannels(login: TwitchUserLogin) {
  const apiChannels = await fetchTwitchChannels(login);
  const channels = apiChannels.data.map(makeChannel);
  const sortedChannels = getSortedChannels(channels, login);
  return sortedChannels;
}
