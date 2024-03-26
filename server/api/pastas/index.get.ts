import assert from "node:assert";
import { z } from "zod";
import { getPastas } from "~/db";

const querySchema = z
  .object({
    next: z.string().nullish(),
  })
  .transform(({ next }) => {
    if (next === null || next === undefined) {
      return { next: null };
    }
    const number = Number(next);
    assert.ok(
      Number.isInteger(number),
      createError({
        statusCode: 400,
        message: "Next cursor must be a integer",
      }),
    );
    return {
      next: number,
    };
  });

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { next } = querySchema.parse(getQuery(event));
  const { pastas, next: newNext } = await getPastas(user.twitch.id, next);
  return {
    pastas,
    next: newNext,
    user,
  };
});
