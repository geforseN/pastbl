import { z } from "zod";
import consola from "consola";
import { setResponseStatus } from "#app/composables/ssr";

const bodySchema = z.object({
  login: z.string().refine(isTwitchUserLogin),
  message: z.string(),
});

const successfulResponseSchema = z.object({
  message_id: z.string(),
  is_sent: z.literal(true),
  drop_reason: z.null(),
});

const responseSchema = z.union([
  z
    .object({
      error: z.string(),
      status: z.number(),
      message: z.string(),
    })
    .transform((error) => ({
      error,
      isSent: false as const,
    })),
  z
    .object({
      data: z
        .array(successfulResponseSchema)
        .length(1),
    })
    .transform((response) => ({
      isSent: successfulResponseSchema.parse(response.data[0]).is_sent,
    })),
]);

const getTwitchUser = defineCachedFunction(fetchTwitchUser, {
  maxAge: 60 * 10 /* 10 minutes */,
  name: "getTwitchUserForTwitchChatMessages",
  getKey: (login) => login,
});

export default defineEventHandler(async (event) => {
  setTwitchHeaders(event);
  setHeaders(event, {
    "Access-Control-Allow-Headers": "Content-Type",
  });
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const body = bodySchema.parse(await readBody(event));
  try {
    // LINK: https://dev.twitch.tv/docs/api/reference/#send-chat-message
    const broadcaster = await getTwitchUser(body.login);
    const response = await fetchTwitchApi("/chat/messages", {
      method: "POST",
      ignoreResponseError: true,
      body: {
        broadcaster_id: broadcaster.id,
        sender_id: userTwitchId,
        /* TODO: also can accept pastaId in body and then get pasta text via db call */
        message: body.message,
      },
    });
    const result = responseSchema.parse(response);
    if (!result.isSent) {
      setResponseStatus(event, result.error.status);
    }
    return result;
  } catch (error) {
    consola
      .withTag("twitch-chat-messages")
      .error("Unknown error occurred, catch block should be unreachable", { error, cause: error?.cause });
    return {
      isSent: false,
      error,
    };
  }
});
