// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TwitchApi {
  export interface GlobalEmote {
    format: ("animated" | "static")[];
    id: string;
    images: { [K in 1 | 2 | 4 as `url_${K}x`]: string };
    name: string;
    scale: ["1.0", "2.0", "3.0"];
    theme_mode: ["light", "dark"];
  }

  export interface ChatEmotesResponse {
    data: GlobalEmote[];
    template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
  }

  export interface GetUsersResponse {
    data: {
      broadcaster_type: "affiliate" | "partner" | "";
      created_at: string /*  "____-__-__T__:__:__Z" */;
      description: string;
      display_name: string;
      id: `${number}`;
      login: string;
      offline_image_url: string;
      profile_image_url: string;
      type: "" | "admin" | "global_mod" | "staff";
    }[];
  }

  export type User = GetUsersResponse["data"][number];

  export interface GetEmoteSetResponse {
    data: {
      id: string;
      name: string;
      images: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
      };
      emote_type: "bitstier" | "follower" | "subscriptions";
      emote_set_id: string;
      owner_id: string;
      format: ["static"] | ["static", "animated"];
      scale: ("1.0" | "2.0" | "3.0")[];
      theme_mode: ["light" | "dark"][];
    };
    template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
  }

  export interface GetSearchChannelsResponse {
    data: {
      broadcaster_language: string;
      broadcaster_login: string;
      display_name: string;
      game_id: string;
      game_name: string;
      id: string;
      is_live: boolean;
      /** @deprecated, now it's always an empty array, use tags instead */
      tag_ids: string[];
      tags: string[];
      thumbnail_url: string;
      title: string;
      started_at: string;
    }[];
  }

  export type SearchChannel = GetSearchChannelsResponse["data"][number];

  export interface GetChatEmotesResponse {
    data: {
      id: `${number}`;
      name: string;
      images: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
      };
      // NOTE: tier field contains the tier information only if emote_type is set to subscriptions, otherwise, it’s an empty string.
      tier: string | "";
      emote_type: "bitstier" | "follower" | "subscriptions";
      emote_set_id: string;
      format: ("animated" | "static")[];
      scale: ("1.0" | "2.0" | "3.0")[];
      theme_mode: ["light" | "dark"][];
    }[];
    template: "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}";
  }

  export type ChatEmote = GetChatEmotesResponse["data"][number];
}
