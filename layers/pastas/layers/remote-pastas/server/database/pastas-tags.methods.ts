import { and, eq } from "drizzle-orm";
import { raise } from "../../../../../../app/utils/raise";
import { assert } from "../../../../../../app/utils/assert";
import { pastasTags, type Pasta } from "~~/database/schema.ts";
import { database } from "~~/database/setup.ts";
import { setDifferenceOtTwoSets } from "~/utils/set.ts";
import { pastasConfig } from "$/pastas/app.config";

function addPastaTag(pastaId: Pasta["id"], value: string) {
  return database.transaction(async (transaction) => {
    const tags = await transaction.query.pastasTags.findMany({
      where: eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < pastasConfig.pastaTags.count.max);
    await transaction
      .insert(pastasTags)
      .values({ pastaId, value })
      .onConflictDoNothing();
  });
}

export function addPastaTags(pastaId: Pasta["id"], values: string[]) {
  assert.ok(
    values.length >= pastasConfig.pastaTags.count.min
    && values.length <= pastasConfig.pastaTags.count.max,
  );
  if (values.length === 1) {
    const value = values[0] || raise();
    return addPastaTag(pastaId, value);
  }
  return database.transaction(async (transaction) => {
    const tags = await transaction.query.pastasTags.findMany({
      where: eq(pastasTags.pastaId, pastaId),
      columns: { value: true },
    });
    assert.ok(tags.length < pastasConfig.pastaTags.count.max);
    const existingTags = new Set(tags.map((tag) => tag.value));
    const tagsToAdd = [
      ...setDifferenceOtTwoSets(new Set(values), existingTags),
    ].slice(0, pastasConfig.pastaTags.count.max - existingTags.size);
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
