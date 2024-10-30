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
    auth: {
      path: import.meta.env.WXT_AUTH_PATH || import.meta.env.WXT_GET_PASTAS_PATH + "/api/auth",
    },
    pastas: {
      get: {
        path: import.meta.env.WXT_GET_PASTAS_PATH,
        init: {
          credentials: "include",
        } satisfies RequestInit,
      },
    },
    contentScript: {
      pollInterval: 300,
    },
  },
} as const;
