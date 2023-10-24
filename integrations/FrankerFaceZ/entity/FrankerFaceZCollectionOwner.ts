import type { FrankerFaceZApiUser } from "../FrankerFaceZ.api";
import type { FrankerFaceZUserBadge } from "./FrankerFaceZUserBadge";

export interface FrankerFaceZCollectionOwner {
  badges: FrankerFaceZUserBadge[];
  avatarUrl: `https://cdn.frankerfacez.com/avatar/${"twitch"}/${number}`;
  displayName: string;
  isDonor: boolean;
  maxEmotes: number;
  twitchId: number | null;
  youtubeId: null | unknown;
}

export class FFZCollectionOwner implements FrankerFaceZCollectionOwner {
  badges;
  avatarUrl;
  displayName;
  isDonor;
  maxEmotes;
  twitchId;
  youtubeId;

  constructor(user: FrankerFaceZApiUser, badges: FrankerFaceZUserBadge[]) {
    this.avatarUrl = user.avatar;
    this.displayName = user.display_name;
    this.isDonor = user.is_donor;
    this.maxEmotes = user.max_emoticons;
    this.twitchId = user.twitch_id;
    this.youtubeId = user.youtube_id;
    this.badges = badges;
  }
}
