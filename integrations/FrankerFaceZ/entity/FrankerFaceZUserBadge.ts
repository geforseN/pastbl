import type { FrankerFaceZApiBadge } from "../FrankerFaceZ.api";

export interface FrankerFaceZUserBadge {
  id: number;
  name: string;
  title: string;
  color: string;
  url: FrankerFaceZApiBadge["image"];
}

export class FFZUserBadge implements FrankerFaceZUserBadge {
  id;
  name;
  title;
  color;
  url;

  constructor(apiBadge: FrankerFaceZApiBadge) {
    this.id = apiBadge.id;
    this.name = apiBadge.name;
    this.title = apiBadge.title;
    this.color = apiBadge.color;
    this.url = apiBadge.image;
  }
}
