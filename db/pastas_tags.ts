import { and, eq } from "drizzle-orm";
import { pastasTags, type Pasta } from "~/db/schema";
import { db } from "~/db";
import { setDifferenceOtTwoSets } from "~/utils/set";

function addPastaTag(pastaId: Pasta["id"], value: string) {
  return db.transaction(async (tx) => {
    const tags = await tx.query.pastasTags.findMany({
      where: (pastasTags, { eq }) => eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < MAX_TAGS_IN_PASTA);
    await tx
      .insert(pastasTags)
      .values({ pastaId, value })
      .onConflictDoNothing();
  });
}

export function addPastaTags(pastaId: Pasta["id"], values: string[]) {
  assert.ok(values.length && values.length <= MAX_TAGS_IN_PASTA);
  if (values.length === 1) {
    return addPastaTag(pastaId, values[0]);
  }
  return db.transaction(async (tx) => {
    const tags = await tx.query.pastasTags.findMany({
      where: (pastasTags, { eq }) => eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < MAX_TAGS_IN_PASTA);
    const existingTags = new Set(tags.map((tag) => tag.value));
    const tagsToAdd = [
      ...setDifferenceOtTwoSets(new Set(values), existingTags),
    ].slice(0, MAX_TAGS_IN_PASTA - existingTags.size);
    await tx
      .insert(pastasTags)
      .values(tagsToAdd.map((value) => ({ pastaId, value })))
      .onConflictDoNothing();
  });
}

export async function removePastaTag(pastaId: Pasta["id"], value: string) {
  await db
    .delete(pastasTags)
    .where(and(eq(pastasTags.pastaId, pastaId), eq(pastasTags.value, value)));
}

export async function removeAllPastaTags(pastaId: Pasta["id"]) {
  await db.delete(pastasTags).where(eq(pastasTags.pastaId, pastaId));
}
