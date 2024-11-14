import { z } from "zod";
import consola from "consola";

const bodySchema = z.object({
  broadcasterTwitchId: z.string().refine(isTwitchUserId),
  message: z.string(),
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
        .array(
          z.object({
            message_id: z.string(),
            is_sent: z.boolean().refine((value): value is true => value === true, {
              message: "is_sent must be true",
            }),
            drop_reason: z.null(),
          }),
        )
        .length(1),
    })
    .transform((res) => res.data[0])
    .refine((data) => data !== undefined, {
      message: "data is undefined",
    })
    .transform((data) => ({
      isSent: data.is_sent,
    })),
]);

export default defineEventHandler(async (event) => {
  setTwitchHeaders(event);
  setHeaders(event, {
    "Access-Control-Allow-Headers": "Content-Type",
  });
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const body = bodySchema.parse(await readBody(event));
  try {
    // LINK: https://dev.twitch.tv/docs/api/reference/#send-chat-message
    // data.message_id -  string
    // data.is_sent - boolean
    // data.drop_reason is null when is_sent is true, otherwise:
    // data.drop_reason.code - string
    // data.drop_reason.message - string
    // 400 Bad Request
    //  - The broadcaster_id query parameter is required.
    //  - The ID in the broadcaster_id query parameter is not valid.
    //  - The sender_id query parameter is required.
    //  - The ID in the sender_id query parameter is not valid.
    //  - The text query parameter is required.
    //  - The ID in the reply_parent_message_id query parameter is not valid.
    // 401 Unauthenticated
    //  - The ID in the user_id query parameter must match the user ID in the access token.
    //  - The Authorization header is required and must contain a user access token.
    //  - The user access token must include the user:write:chat scope.
    //  - The access token is not valid.
    //  - The client ID specified in the Client-Id header does not match the client ID specified in the access token.
    // 403 Forbidden
    //  - The sender is not permitted to send chat messages to the broadcaster’s chat room.
    // 422 Unprocessable Entity
    //  - The message is too large.
    const response = await fetchTwitchApi("/chat/messages", {
      method: "POST",
      ignoreResponseError: true,
      body: {
        // TODO: user should send broadcaster nickname, broadcaster id should be fetch from api here
        broadcaster_id: body.broadcasterTwitchId,
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
