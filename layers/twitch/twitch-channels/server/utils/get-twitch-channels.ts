import { groupBy } from "../../../../../app/utils/object";
import type { ITwitchChannel } from "../../utils/types";
import { isLowercase } from "../../../../../app/utils/string";
import { assert } from "../../../../../app/utils/assert";
import type * as TTwitch from "#t_twitch";

function transformChannel(channel: TTwitch.Api.SearchChannel) {
  const login = channel.broadcaster_login;
  assert.ok(isLowercase(login));
  return <ITwitchChannel>{
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
  };
}

function getSortedChannels(channels: ITwitchChannel[]): ITwitchChannel[] {
  const groupedByIsLive = groupBy(channels, (channel) =>
    channel.isLive ? "live" : "notLive",
  );
  const { live = [], notLive = [] } = groupedByIsLive;
  const sorted = [...live, ...notLive];
  return sorted;
}

export async function getTwitchChannels(login: TwitchUserLogin) {
  const apiChannels = await fetchTwitchChannels(login);
  const channels = apiChannels.data.map(transformChannel);
  const sortedChannels = getSortedChannels(channels);
  const exact = sortedChannels.find((channel) => channel.login === login);
  if (exact) {
    sortedChannels.splice(sortedChannels.indexOf(exact), 1);
    sortedChannels.unshift(exact);
    exact.isExact = true;
  }
  return sortedChannels;
}
