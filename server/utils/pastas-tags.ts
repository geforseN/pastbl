import assert from "node:assert";
import { z } from "zod";
import { megaTrim } from "~/utils/string";

export const TAG_MAX_LENGTH = 128;
export const MAX_TAGS_IN_PASTA = 10;

export const pastaTagsSchema = z
  .string()
  .min(1)
  .max(TAG_MAX_LENGTH * MAX_TAGS_IN_PASTA + MAX_TAGS_IN_PASTA - 1)
  .or(z.array(z.string()).min(1).max(MAX_TAGS_IN_PASTA))
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
      tags.length &&
      tags.length <= MAX_TAGS_IN_PASTA &&
      tags.every((tag) => tag.length && tag.length <= TAG_MAX_LENGTH),
  );

const pastaTagSchema = z
  .string()
  .min(1)
  .max(TAG_MAX_LENGTH)
  .transform(megaTrim)
  .refine((tag) => !tag.includes(","));

export async function getPastaTagFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagSchema.parse(body.tag);
}

export async function getPastaTagsFromBody(event: H3E) {
  const body = await readBody(event);
  return pastaTagsSchema.parse(body.tags);
}
