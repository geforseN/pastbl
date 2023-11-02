import type { IEmoteCollection } from ".";

export interface IGlobalEmoteCollection extends IEmoteCollection {
  name: `Global ${IGlobalEmoteCollection["source"]} collection`;
}
