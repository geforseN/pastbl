import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { pastaTagLength, pastaTagsCount } from "~~/config/const";
import { transformPastaTag } from "~/utils/pasta-tag";

const pastaTagSchema = z
  .string()
  .min(pastaTagLength.min)
  .max(pastaTagLength.max)
  .refine((tag) => !tag.includes(","));

export const pastaTagsSchema = z
  .array(pastaTagSchema)
  .min(pastaTagsCount.min)
  .max(pastaTagsCount.max)
  .transform((tags) => {
    return tags
      .filter((tag) => pastaTagSchema.safeParse(tag).success)
      .map(megaTrim)
      .filter((tag) => tag.length >= pastaTagLength.min)
      .map(transformPastaTag);
  });

export async function getPastaTagFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagSchema.parse(body.tag);
}

export async function getPastaTagsFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagsSchema.parse(body.tags);
}
