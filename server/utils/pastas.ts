import assert from "node:assert";
import { z } from "zod";
import type { H3Event, EventHandlerRequest } from "h3";
import { isNullish } from "~/utils/guard";
import type { Nullish } from "~/utils/types";
import { megaTrim } from "~/utils/string";

export const pastaIdParamSchema = z
  .string()
  .min(1)
  .transform(Number)
  .refine(Number.isInteger);

export function getPastaIdParam<E extends H3E>(event: E) {
  return pastaIdParamSchema.parse(getRouterParam(event, "pastaId"));
}

function transformCursor(cursor: Nullish<string>) {
  if (isNullish(cursor)) {
    return null;
  }
  const cursorAsNumber = Number(cursor);
  assert.ok(
    Number.isInteger(cursorAsNumber),
    createError({
      statusCode: 400,
      message: "Next cursor must be a integer",
    }),
  );
  return cursorAsNumber;
}

const pastasCursorQuerySchema = z
  .object({ cursor: z.string().nullish() })
  .transform(({ cursor }) => ({ cursor: transformCursor(cursor) }));

export function getPastasCursorFromQuery<
  E extends H3Event<EventHandlerRequest>,
>(event: E) {
  return pastasCursorQuerySchema.parse(getQuery(event)).cursor;
}

export const PASTA_TEXT_LENGTH = 1984;

export const pastaTextSchema = z
  .string()
  .min(1)
  .max(PASTA_TEXT_LENGTH)
  .transform(megaTrim);

export const pastasPublicity = ["public", "private"] as const;
export type PastaPublicity = (typeof pastasPublicity)[number];
export const defaultPastaPublicity = "public" as const satisfies PastaPublicity;
export const pastaPublicitySchema = z
  .enum(pastasPublicity)
  .default(defaultPastaPublicity);

const patchPastaTextSchema = z.object({
  text: pastaTextSchema,
});

export async function getPastaTextFromBody<E extends H3E>(event: E) {
  return patchPastaTextSchema.parse(await readBody(event)).text;
}

const bodySchema = z.object({
  text: pastaTextSchema,
  tags: pastaTagsSchema,
  publicity: pastaPublicitySchema,
});

export async function getPastaFromBody<E extends H3E>(event: E) {
  return bodySchema.parse(await readBody(event));
}
