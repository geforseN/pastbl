import { z } from "zod";
import { getQuery } from "h3";

export const pastasCursorQuerySchema = z
  .object({
    cursor: z.string().nullish().default(null),
  })
  .transform((query) => {
    const int = Number.parseInt((query.cursor || ""), 10);
    const cursor = Number.isNaN(int) || int <= 0 ? null : int;
    return {
      cursor,
    };
  });

export function getPastasCursorFromQuery(event: H3Event) {
  const query = getQuery(event);
  const parsed = pastasCursorQuerySchema.parse(query).cursor;
  return parsed;
}
