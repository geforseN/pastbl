import type { SevenTVApiUserProfile } from "../SevenTV.api";

export interface I7TVCollectionOwner {
  avatarUrl: string;
  displayName: string;
  linkedAt: number;
  biography: string;
  username: Lowercase<I7TVCollectionOwner["displayName"]>;
  style: { color?: number };
}

export class SevenTVCollectionOwner implements I7TVCollectionOwner {
  avatarUrl;
  displayName;
  linkedAt;
  style;
  username;
  biography;

  constructor(profile: SevenTVApiUserProfile) {
    this.avatarUrl = `https:${profile.user.avatar_url}`;
    this.displayName = profile.display_name;
    this.username = profile.username;
    this.style = profile.user.style;
    this.linkedAt = profile.linked_at;
    this.biography = profile.user.biography;
  }
}
