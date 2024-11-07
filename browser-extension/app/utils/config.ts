let pastblBasePath = import.meta.env.WXT_PASTBL_BASE_PATH;
if (!pastblBasePath) {
  consola.info("WXT_PASTBL_BASE_URL is not set, using `https://localhost:3000`");
  pastblBasePath = "http://localhost:3000";
} else if (typeof pastblBasePath !== "string") {
  throw new TypeError("provided WXT_PASTBL_BASE_URL env variable is not a string");
} else if (pastblBasePath.endsWith("/")) {
  consola.info("WXT_PASTBL_BASE_URL ends with `/`, removing it");
  pastblBasePath = pastblBasePath.slice(0, -1);
}
consola.info("final pastblBasePath is", pastblBasePath);

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
  pastblBasePath + "/auth/twitch",
);

const pastblGetPastasPath = withDefaultValueIfNotString(
  import.meta.env.WXT_PASTBL_GET_PASTAS_PATH,
  pastblBasePath + "/api/v1/pastas",
);

const pastblPostPastasPath = withDefaultValueIfNotString(
  import.meta.env.WXT_PASTBL_GET_PASTAS_PATH,
  pastblBasePath + "/api/v1/pastas",
);

export const config = {
  twitch: {
    chatMessagesContainer: {
      selector: ".chat-scrollable-area__message-container",
      messageBody: {
        finders: [
          (target) => target.querySelector("[data-a-target=\"chat-line-message-body\"]"),
          (target) => target.querySelector("span.message"),
          (target) => target.closest("[data-a-target=\"chat-line-message-body\"]"),
          (target) => target.closest("span.message"),
          (target) => target.closest(".chat-line__message")
            ?.querySelector?.(".chat-line__message-container [data-a-target=\"chat-line-message-body\"]")
            ?? null,
        ] satisfies ((target: HTMLElement) => HTMLElement | null)[],
      },
    },
  },
  pastbl: {
    baseUrl: pastblBasePath,
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
      post: {
        path: pastblPostPastasPath,
      },
    },
    contentScript: {
      pollInterval: 300,
      maxAttemptCount: 20,
      chatMessages: {
        pollInterval: 300,
        maxAttemptCount: 20,
      },
    },
  },
} as const;
