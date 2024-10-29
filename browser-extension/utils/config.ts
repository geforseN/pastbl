export const config = {
  twitch: {
    "chat-input": {
      "buttons-container": {
        selector: ".chat-input__buttons-container",
      },
    },
  },
  pastbl: {
    baseUrl: "https://pastbl.vercel.app",
    pastas: {
      get: {
        path: import.meta.env.WXT_GET_PASTAS_PATH,
        init: {
          credentials: "include",
        } satisfies RequestInit,
      },
    },
  },
} as const;
