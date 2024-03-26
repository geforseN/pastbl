import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, desc, eq, lt } from "drizzle-orm";
import { pastas, pastasTags, type Pasta, type PastaPublicity } from "./schema";
import * as schema from "./schema";

export const client = postgres(env.databaseUrl);
export const db = drizzle(client, { schema });

export function createPasta(
  text: string,
  tags: string[],
  publisherTwitchId: string,
  publicity: PastaPublicity,
) {
  return db.transaction(async (tx) => {
    const [pasta] = await tx
      .insert(pastas)
      .values({ text, publisherTwitchId, publicity })
      .returning();
    if (tags.length) {
      const pastaId = pasta.id;
      await tx
        .insert(pastasTags)
        .values(tags.map((value) => ({ value, pastaId })));
    }
    return {
      ...pasta,
      tags,
    };
  });
}

// TODO: use 'with clause' or/and 'prepared statement' in SQL queries

export const FIRST_PAGE_PASTAS_COUNT = 15;

export function getFirstPagePastas(
  publisherTwitchId: Pasta["publisherTwitchId"],
) {
  return db
    .select({
      id: pastas.id,
      text: pastas.text,
      publicity: pastas.publicity,
      publishedAt: pastas.publishedAt,
    })
    .from(pastas)
    .where(eq(pastas.publisherTwitchId, publisherTwitchId))
    .orderBy(pastas.publisherTwitchId, desc(pastas.publishedAt))
    .limit(FIRST_PAGE_PASTAS_COUNT);
}

export const CURSOR_BASED_PASTAS_COUNT = 10;

export function getNextPagePastas(
  publisherTwitchId: Pasta["publisherTwitchId"],
  pastaId: Pasta["id"],
) {
  return db
    .select({
      id: pastas.id,
      text: pastas.text,
      publicity: pastas.publicity,
      publishedAt: pastas.publishedAt,
    })
    .from(pastas)
    .where(
      and(
        eq(pastas.publisherTwitchId, publisherTwitchId),
        lt(pastas.id, pastaId),
      ),
    )
    .orderBy(pastas.publisherTwitchId, desc(pastas.publishedAt))
    .limit(CURSOR_BASED_PASTAS_COUNT);
}

export function deletePasta(pastaId: Pasta["id"]) {
  return db.delete(pastas).where(eq(pastas.id, pastaId)).returning();
}

// LINK: https://orm.drizzle.team/docs/joins#many-to-many-example

export function getPastasWithNoTags(publisherTwitchId: string) {
  return db
    .select()
    .from(pastas)
    .where(eq(pastas.publisherTwitchId, publisherTwitchId));
}
