import type { SevenTVApiUserProfile } from "../SevenTV.api";

export interface I7TVCollectionOwner {
  avatarUrl: string;
  capacity: number;
  displayName: string;
  linkedAt: number;
  style: { color?: number };
}

export class SevenTVCollectionOwner implements I7TVCollectionOwner {
  avatarUrl;
  capacity;
  displayName;
  linkedAt;
  style;

  constructor(profile: SevenTVApiUserProfile) {
    this.avatarUrl = `https:${profile.user.avatar_url}`;
    this.displayName = profile.display_name;
    this.style = profile.user.style;
    this.linkedAt = profile.linked_at;
    this.capacity = profile.emote_capacity;
  }
}
