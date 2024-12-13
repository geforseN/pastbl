import { z } from "zod";
import { megaTrim } from "../../../../../../app/utils/string";
import { transformPastaTag } from "../../../chat-pasta/utils/pasta-tag.ts";
import { pastasConfig } from "../../../../config.ts";

const pastaTagSchema = z
  .string()
  .min(pastasConfig.pastaTag.length.min)
  .max(pastasConfig.pastaTag.length.max)
  .refine((tag) => !tag.includes(","));

export const pastaTagsSchema = z
  .array(pastaTagSchema)
  .min(pastasConfig.pastaTags.count.min)
  .max(pastasConfig.pastaTags.count.max)
  .transform((tags) => {
    return tags
      .filter((tag) => pastaTagSchema.safeParse(tag).success)
      .map(megaTrim)
      .filter((tag) => tag.length >= pastasConfig.pastaTag.length.min)
      .map(transformPastaTag);
  });

export async function getPastaTagFromBody(event: H3Event) {
  const body = await readBody(event);
  return pastaTagSchema.parse(body.tag);
}

export async function getPastaTagsFromBody(event: H3Event) {
  const body = await readBody(event);
  return pastaTagsSchema.parse(body.tags);
}
