import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { pastaTagLength, pastaTagsCount } from "~/config/const";

const lowercaseMentionTag = (tag: string) =>
  tag.startsWith("@") ? tag.toLowerCase() : tag;

const pastaTagSchema = z
  .string()
  .min(pastaTagLength.min)
  .max(pastaTagLength.max)
  .refine((tag) => !tag.includes(","))
  .transform(megaTrim)
  .transform(lowercaseMentionTag);

export const pastaTagsSchema = z
  .string()
  .min(pastaTagLength.min)
  .max(pastaTagLength.max * pastaTagsCount.max + pastaTagsCount.max - 1)
  .or(z.array(pastaTagSchema).min(pastaTagsCount.min).max(pastaTagsCount.max))
  .transform((value) => {
    if (typeof value === "string") {
      value = value.split(",");
    } else {
      value = value.filter((tag) => !tag.includes(","));
    }
    return value
      .map(megaTrim)
      .filter((tag) => tag.length)
      .map(lowercaseMentionTag);
  })
  .refine(
    (tags) =>
      tags.length >= pastaTagsCount.min &&
      tags.length <= pastaTagsCount.max &&
      tags.every(
        (tag) =>
          tag.length >= pastaTagLength.min && tag.length <= pastaTagLength.max,
      ),
  );

export async function getPastaTagFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagSchema.parse(body.tag);
}

export async function getPastaTagsFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagsSchema.parse(body.tags);
}
