import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { isEmptyObject } from "~/utils/guard";
import { pastaTextLength } from "~/config/const";

export const pastaIdParamSchema = z.coerce.number().safe().int().positive();

export function getPastaIdParam(event: H3E) {
  return pastaIdParamSchema.parse(getRouterParam(event, "pastaId"));
}

const pastasCursorQuerySchema = z.object({
  cursor: pastaIdParamSchema.nullish().default(null),
});

export function getPastasCursorFromQuery(event: H3E) {
  return pastasCursorQuerySchema.parse(getQuery(event)).cursor;
}

export const pastaTextSchema = z
  .string()
  .min(pastaTextLength.min)
  .max(pastaTextLength.max)
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
