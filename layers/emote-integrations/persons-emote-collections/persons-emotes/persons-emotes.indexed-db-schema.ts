import type { DBSchema } from "idb";
import type { IEmote } from "$/emote-integrations/base/Emote";
import type { EmoteId } from "~/brands";

export interface PersonsEmotesIndexedDBSchema extends DBSchema {
  "persons-emotes": {
    key: [IEmote["source"], EmoteId];
    /* FIXME: use combined type from all emote integrations, so this object will have many 'source' and many 'type' variants */
    value: IEmote;
    indexes: {
      byId: EmoteId;
      bySource: IEmote["source"];
      byToken: IEmote["token"];
      byTags: string;
    };
  };
}
