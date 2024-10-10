import {
  SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE,
  UNDEFINED_RECEIVED_ERROR_MESSAGE,
} from "./-constants";
import { emoteSourcesQuerySchema } from "./-zod-schemas";

export function getEmoteSourcesFromQuery(event: H3Event) {
  const parse = emoteSourcesQuerySchema.safeParse(getQuery(event));
  if (parse.error) {
    let message: string;
    if (
      parse.error.issues.some(
        (issue) => issue.message === SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE,
      )
    ) {
      message = SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE;
    }
    else if (
      parse.error.issues.some(
        (issue) =>
          issue.code === "invalid_type" && issue.received === "undefined",
      )
    ) {
      message = UNDEFINED_RECEIVED_ERROR_MESSAGE;
    }
    else {
      message = parse.error.toString();
    }
    throw createError({
      statusCode: 400,
      statusMessage: message,
      message,
      data: { message },
    });
  }

  return parse.data.sources;
}
