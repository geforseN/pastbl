import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { isEmptyObject } from "~/utils/guard";
import { pastaTagsSchema } from "~~/layers/pastas/remote-pastas/server/utils/pastas-tags";
import { pastaTextLength } from "~~/config/const";

const pastaIdParamSchema = z.coerce.number().safe().int().positive();

export function getPastaIdParam(event: H3Event) {
  return pastaIdParamSchema.parse(getRouterParam(event, "pastaId"));
}

const pastasCursorQuerySchema = z
  .object({
    cursor: z.string().nullish().default(null),
  })
  .transform(({ cursor }) => {
    return {
      cursor: cursor === "" ? null : Number(cursor),
    };
  });

export function getPastasCursorFromQuery(event: H3Event) {
  const query = getQuery(event);
  console.log({ query });
  const parsed = pastasCursorQuerySchema.parse(query).cursor;
  console.log({ parsed });
  return parsed;
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

export async function getPastaTextFromBody(event: H3Event) {
  return patchPastaTextSchema.parse(await readBody(event)).text;
}

const postPastaSchema = z.object({
  text: pastaTextSchema,
  tags: pastaTagsSchema,
  publicity: pastaPublicitySchema,
});

export async function getPastaFromBody(event: H3Event) {
  return postPastaSchema.parse(await readBody(event));
}

const patchPastaPublicitySchema = z
  .object({
    publicity: pastaPublicitySchema,
  })
  .strict();

export async function getPastaPublicityFromBody(event: H3Event) {
  return patchPastaPublicitySchema.parse(await readBody(event)).publicity;
}

const patchPastaSchema = patchPastaTextSchema
  .merge(patchPastaPublicitySchema)
  .partial()
  .refine((object) => !isEmptyObject(object));

export async function getPastaPatchesFromBody(event: H3Event) {
  return patchPastaSchema.parse(await readBody(event));
}
