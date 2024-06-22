import type { ITwitchGlobalEmoteResponse } from "~/integrations/Twitch";

type ApiTwitchGetUsersResponse = {
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
    /** @deprecated */
    view_count?: number;
  }[];
};

export type ApiTwitchGetChatEmotesResponse = {
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
};

type ApiTwitchGetEmoteSetResponse = {
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
};

type ApiTwitchGetSearchChannelsResponse = {
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
};

export type TwitchApi = {
  getUser: {
    response: ApiTwitchGetUsersResponse;
    responseItem: ApiTwitchGetUsersResponse["data"][number];
  };
  getGlobalEmotes: {
    response: ITwitchGlobalEmoteResponse;
    responseItem: ITwitchGlobalEmoteResponse["data"][number];
  };
  getChatEmotes: {
    response: ApiTwitchGetChatEmotesResponse;
    responseItem: ApiTwitchGetChatEmotesResponse["data"][number];
  };
  getChatEmotesSet: {
    response: ApiTwitchGetEmoteSetResponse;
    responseItem: ApiTwitchGetEmoteSetResponse["data"];
  };
  getSearchChannels: {
    response: ApiTwitchGetSearchChannelsResponse;
    responseItem: ApiTwitchGetSearchChannelsResponse["data"][number];
  };
};

export type TwitchApiResponse_ = {
  getUser: ApiTwitchGetUsersResponse;
  getChatEmotes: ApiTwitchGetChatEmotesResponse;
  getSearchChannels: ApiTwitchGetSearchChannelsResponse;
};

export type TwitchApiResponseItem_ = {
  getUser: ApiTwitchGetUsersResponse["data"][number];
  getChatEmotes: ApiTwitchGetChatEmotesResponse["data"][number];
  getSearchChannels: ApiTwitchGetSearchChannelsResponse["data"][number];
};
