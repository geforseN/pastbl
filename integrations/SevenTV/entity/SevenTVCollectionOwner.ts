import type { SevenTVApiUserProfile } from "../SevenTV.api";

export interface I7TVCollectionOwner {
  avatarUrl: string;
  capacity: number;
  displayName: string;
  linkedAt: number;
  biography: string;
  login: Lowercase<I7TVCollectionOwner["displayName"]>;
  style: { color?: number };
}

export class SevenTVCollectionOwner implements I7TVCollectionOwner {
  avatarUrl;
  capacity;
  displayName;
  linkedAt;
  style;
  login;
  biography;

  constructor(profile: SevenTVApiUserProfile) {
    this.avatarUrl = `https:${profile.user.avatar_url}`;
    this.capacity = profile.emote_capacity;
    this.displayName = profile.display_name;
    this.login = profile.username;
    this.style = profile.user.style;
    this.linkedAt = profile.linked_at;
    this.biography = profile.user.biography;
  }
}
