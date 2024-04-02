import assert from "node:assert";
import { z } from "zod";
import { megaTrim } from "~/utils/string";
import { pastaTagLength, pastaTagsCount } from "~/config/const";

const pastaTagSchema = z
  .string()
  .min(pastaTagLength.min)
  .max(pastaTagLength.max)
  .refine((tag) => !tag.includes(","))
  .transform(megaTrim)
  .transform((tag) => (tag.startsWith("@") ? tag.toLowerCase() : tag));

export const pastaTagsSchema = z
  .string()
  .min(pastaTagLength.min)
  .max(pastaTagLength.max * pastaTagsCount.max + pastaTagsCount.max - 1)
  .or(z.array(pastaTagSchema).min(pastaTagLength.min).max(pastaTagLength.max))
  .transform((value) => {
    if (typeof value === "string") {
      value = value.split(",");
    } else {
      assert.ok(value.every((tag) => !tag.includes(",")));
    }
    return value.map(megaTrim).filter((tag) => tag.length);
  })
  .refine(
    (tags) =>
      tags.length >= pastaTagLength.min &&
      tags.length <= pastaTagLength.max &&
      tags.every(
        (tag) =>
          tag.length >= pastaTextLength.min &&
          tag.length <= pastaTextLength.max,
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
