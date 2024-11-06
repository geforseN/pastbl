export const twitchConfig = {
  twitchUser: {
    id: {
      length: {
        max: 64,
      },
    },
    login: {
      length: {
        min: 3,
        max: 25,
      },
    },
  },
} as const;
