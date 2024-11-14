import consola from "consola";
import { z } from "zod";
import { isObject, isBoolean } from "~/utils/guards";

const bodySchema = z.object({
  broadcasterTwitchId: z.string().refine(isTwitchUserId),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  setTwitchHeaders(event);
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const body = bodySchema.parse(await readBody(event));
  try {
    // LINK: https://dev.twitch.tv/docs/api/reference/#send-chat-message
    // data.message_id
    // data.is_sent
    // data.drop_reason.code
    // data.drop_reason.message
    const data = await fetchTwitchApi("/chat/messages", {
      method: "POST",
      body: {
        broadcaster_id: body.broadcasterTwitchId,
        sender_id: userTwitchId,
        /* TODO: also can accept pastaId in body and then get pasta text via db call */
        message: body.message,
      },
    });
    assert.ok(isObject(data) && isBoolean(data.is_sent));
    const result = {
      isSent: data.is_sent,
    };
    if (data.drop_reason) {
      if (result.isSent) {
        consola.warn("message is sent, but drop_reason is present", { data, result });
      }
      Object.assign(result, { dropReason: { ...data.drop_reason } });
    }
    return result;
  } catch {
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
    return {
      isSent: false,
      // FIXME: add drop_reason
    };
  }
});
