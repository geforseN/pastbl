import type { DBSchema } from "idb";
import type { IEmote } from "~/integrations/abstract";

export interface EmotesSchema extends DBSchema {
  emotes: {
    key: [IEmote["id"], IEmote["source"]];
    value: IEmote;
    indexes: {
      byId: IEmote["id"];
      bySource: IEmote["source"];
      byToken: IEmote["token"];
      byTags: string;
    };
  };
}
