import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { pastas, type Pasta } from "~/db/schema";

export async function patchPastaText(
  pastaId: Pasta["id"],
  publisherTwitchId: Pasta["publisherTwitchId"],
  text: Pasta["text"],
) {
  // TODO: with transaction add old pastas in previousPastas table
  const [pasta] = await db
    .update(pastas)
    .set({ text, updatedAt: sql`now()` })
    .where(
      and(
        eq(pastas.publisherTwitchId, publisherTwitchId),
        eq(pastas.id, pastaId),
      ),
    )
    .returning();
  assert.ok(pasta, "Failed to update pasta text");
  return pasta;
}
