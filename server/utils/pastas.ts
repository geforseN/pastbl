import assert from "node:assert";
import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { isEmptyObject, isNullish } from "~/utils/guard";
import type { Nullish } from "~/utils/types";

export const pastaIdParamSchema = z.coerce.number().int().positive();

export function getPastaIdParam(event: H3E) {
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

export function getPastasCursorFromQuery(event: H3E) {
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
export const pastaPublicitySchema = z.enum(pastasPublicity);

const patchPastaTextSchema = z
  .object({
    text: pastaTextSchema,
  })
  .strict();

export async function getPastaTextFromBody(event: H3E) {
  return patchPastaTextSchema.parse(await readBody(event)).text;
}

const postPastaSchema = z.object({
  text: pastaTextSchema,
  tags: pastaTagsSchema,
  publicity: pastaPublicitySchema,
});

export async function getPastaFromBody(event: H3E) {
  return postPastaSchema.parse(await readBody(event));
}

const patchPastaPublicitySchema = z
  .object({
    publicity: pastaPublicitySchema,
  })
  .strict();

export async function getPastaPublicityFromBody(event: H3E) {
  return patchPastaPublicitySchema.parse(await readBody(event)).publicity;
}

const patchPastaSchema = patchPastaTextSchema
  .merge(patchPastaPublicitySchema)
  .partial()
  .refine((object) => !isEmptyObject(object));

export async function getPastaPatchesFromBody(event: H3E) {
  return patchPastaSchema.parse(await readBody(event));
}
