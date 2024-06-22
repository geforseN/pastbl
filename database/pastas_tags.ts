import { and, eq } from "drizzle-orm";
import { pastasTags, type Pasta } from "~~/database/schema";
import { database } from "~~/database";
import { setDifferenceOtTwoSets } from "~/utils/set";
import { pastaTagsCount } from "~~/config/const";

function addPastaTag(pastaId: Pasta["id"], value: string) {
  return database.transaction(async (transaction) => {
    const tags = await transaction.query.pastasTags.findMany({
      where: eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < pastaTagsCount.max);
    await transaction
      .insert(pastasTags)
      .values({ pastaId, value })
      .onConflictDoNothing();
  });
}

export function addPastaTags(pastaId: Pasta["id"], values: string[]) {
  assert.ok(
    values.length >= pastaTagsCount.min && values.length <= pastaTagsCount.max,
  );
  if (values.length === 1) {
    return addPastaTag(pastaId, values[0]);
  }
  return database.transaction(async (transaction) => {
    const tags = await transaction.query.pastasTags.findMany({
      where: eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < pastaTagsCount.max);
    const existingTags = new Set(tags.map((tag) => tag.value));
    const tagsToAdd = [
      ...setDifferenceOtTwoSets(new Set(values), existingTags),
    ].slice(0, pastaTagsCount.max - existingTags.size);
    await transaction
      .insert(pastasTags)
      .values(tagsToAdd.map((value) => ({ pastaId, value })))
      .onConflictDoNothing();
  });
}

export async function removePastaTag(pastaId: Pasta["id"], value: string) {
  await database
    .delete(pastasTags)
    .where(and(eq(pastasTags.pastaId, pastaId), eq(pastasTags.value, value)));
}

export async function removeAllPastaTags(pastaId: Pasta["id"]) {
  await database.delete(pastasTags).where(eq(pastasTags.pastaId, pastaId));
}
