let pastblBaseUrl = import.meta.env.WXT_PASTBL_GET_PASTAS_PATH;
if (!pastblBaseUrl) {
  consola.info("WXT_PASTBL_BASE_URL is not set, using `https://localhost:3000`");
  pastblBaseUrl = "http://localhost:3000";
} else if (typeof pastblBaseUrl !== "string") {
  throw new TypeError("provided WXT_PASTBL_BASE_URL env variable is not a string");
} else if (pastblBaseUrl.endsWith("/")) {
  consola.info("WXT_PASTBL_BASE_URL ends with `/`, removing it");
  pastblBaseUrl = pastblBaseUrl.slice(0, -1);
}
consola.info("final pastblBaseUrl is", pastblBaseUrl);

function withDefaultValueIfNotString(value: unknown, defaultValue: string) {
  if (typeof value !== "string") {
    if (defaultValue === undefined) {
      throw new TypeError("defaultValue is not provided");
    }
    return defaultValue;
  }
  return value;
};

const pastblAuthPathViaTwitch = withDefaultValueIfNotString(
  import.meta.env.WXT_PASTBL_AUTH_VIA_TWITCH_PATH,
  pastblBaseUrl + "/auth/twitch",
);

const pastblGetPastasPath = withDefaultValueIfNotString(
  import.meta.env.WXT_PASTBL_GET_PASTAS_PATH,
  pastblBaseUrl + "/api/v1/pastas",
);

export const config = {
  twitch: {
    "chat-input": {
      "buttons-container": {
        selector: ".chat-input__buttons-container",
      },
    },
  },
  pastbl: {
    baseUrl: pastblBaseUrl,
    auth: {
      twitch: {
        path: pastblAuthPathViaTwitch,
      },
    },
    pastas: {
      get: {
        path: pastblGetPastasPath,
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
