import { z } from "zod";
import { createPasta } from "~/db";
import { MAX_TAGS_IN_PASTA, PASTA_TEXT_LENGTH } from "~/db/schema";
import { megaTrim } from "~/utils/string";

const bodySchema = z.object({
  text: z.string().max(PASTA_TEXT_LENGTH).transform(megaTrim),
  tags: z
    .array(z.string())
    .max(MAX_TAGS_IN_PASTA)
    .optional()
    .default([])
    .transform((tags) => tags.map(megaTrim))
    .refine((tags) => tags.every((tag) => !tag.includes(","))),
  isPublic: z.boolean().default(true),
});

export default defineEventHandler(async (event) => {
  const { text, tags, isPublic } = bodySchema.parse(await readBody(event));
  const session = await requireUserSession(event);
  const publisherTwitchId = session.user.twitch.id;
  const publicity = isPublic ? "public" : "private";
  const pasta = await createPasta(text, tags, publisherTwitchId, publicity);
  return {
    pasta,
  };
});
