import { z } from "zod";
import { db } from "~/db";
import { pastas, pastasTags, tagsToPastas } from "~/db/schema";

const bodySchema = z.object({
  text: z.string(),
  tags: z
    .array(z.string())
    .optional()
    .transform((tags) => tags ?? []),
});

export default defineEventHandler(async (event) => {
  const { tags, text } = bodySchema.parse(await readBody(event));
  const session = await requireUserSession(event);
  const authorTwitchId = session.user.twitch.id;
  const pasta = await db.transaction(async (tx) => {
    const [pasta] = await tx
      .insert(pastas)
      .values({ text, authorTwitchId })
      .returning();
    await tx
      .insert(pastasTags)
      .values(tags.map((value) => ({ value })))
      .onConflictDoNothing();
    await tx
      .insert(tagsToPastas)
      .values(tags.map((tagValue) => ({ tagValue, pastaUuid: pasta.uuid })));
    return {
      ...pasta,
      tags,
    };
  });
  return {
    pasta,
  };
});
