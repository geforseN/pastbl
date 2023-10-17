import { DBSchema } from "idb";

export interface EmoteCollection extends DBSchema {
  "current-collection-name": {
    key: string;
    value: string;
  };
  "saved-collections": {
    value: {
      nickname: string;
      isLoadedCorrectly: boolean;
      bttv?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
      "7tv"?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
      ffz?: {
        emotes: {
          name: string;
          src: string;
        }[];
      };
    };
    key: string /* key is twitch nickname */;
    indexes: { "by-price": number };
  };
}
