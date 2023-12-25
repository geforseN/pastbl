import { raise } from "~/utils/error";

export const twitchApiFetch = $fetch.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    "Client-ID":
      process.env.TWITCH_APP_CLIENT_ID ||
      raise("TWITCH_APP_CLIENT_ID not defined in .env"),
  },
});

// GET https://api.twitch.tv/helix/channels (title & game data)

// GET https://api.twitch.tv/helix/subscriptions (need user access token)

// GET https://api.twitch.tv/helix/teams/channel
// GET https://api.twitch.tv/helix/teams

// https://dev.twitch.tv/docs/irc/emotes/
//   GET https://api.twitch.tv/helix/chat/emotes
//   GET https://api.twitch.tv/helix/chat/emotes/global
//   GET https://api.twitch.tv/helix/chat/emotes/set

// GET https://api.twitch.tv/helix/chat/badges/global
// GET https://api.twitch.tv/helix/chat/badges

// GET https://api.twitch.tv/helix/chat/settings

// GET https://api.twitch.tv/helix/chat/color
