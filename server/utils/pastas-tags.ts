import assert from "node:assert";
import { z } from "zod";
import { megaTrim } from "~/utils/string";

export const PASTA_TAG_MIN_LENGTH = 1;
export const PASTA_TAG_MAX_LENGTH = 128;
export const pastaTagLength = {
  min: PASTA_TAG_MIN_LENGTH,
  max: PASTA_TAG_MAX_LENGTH,
} as const;

export const MIN_TAGS_IN_PASTA = 0;
export const MAX_TAGS_IN_PASTA = 10;
export const pastaTagsCount = {
  min: MIN_TAGS_IN_PASTA,
  max: MAX_TAGS_IN_PASTA,
};

const pastaTagSchema = z
  .string()
  .min(PASTA_TAG_MAX_LENGTH)
  .max(PASTA_TAG_MAX_LENGTH)
  .refine((tag) => !tag.includes(","))
  .transform(megaTrim)
  .transform((tag) => (tag.startsWith("@") ? tag.toLowerCase() : tag));

export const pastaTagsSchema = z
  .string()
  .min(PASTA_TAG_MAX_LENGTH)
  .max(PASTA_TAG_MAX_LENGTH * MAX_TAGS_IN_PASTA + MAX_TAGS_IN_PASTA - 1)
  .or(z.array(pastaTagSchema).min(MIN_TAGS_IN_PASTA).max(MAX_TAGS_IN_PASTA))
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
      tags.length >= MIN_TAGS_IN_PASTA &&
      tags.length <= MAX_TAGS_IN_PASTA &&
      tags.every(
        (tag) =>
          tag.length >= PASTA_TAG_MIN_LENGTH &&
          tag.length <= PASTA_TAG_MAX_LENGTH,
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
