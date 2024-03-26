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

const FIRST_PAGE_PASTAS_COUNT = 15;

function getFirstPagePastas(publisherTwitchId: Pasta["publisherTwitchId"]) {
  return db.query.pastas.findMany({
    columns: {
      updatedAt: false,
      publisherTwitchId: false,
    },
    where: eq(pastas.publisherTwitchId, publisherTwitchId),
    orderBy: [pastas.publisherTwitchId, desc(pastas.id)],
    limit: FIRST_PAGE_PASTAS_COUNT,
    with: {
      tags: true,
    },
  });
}

const CURSOR_BASED_PASTAS_COUNT = 10;

function getNextPagePastas(
  publisherTwitchId: Pasta["publisherTwitchId"],
  pastaId: Pasta["id"],
) {
  return db.query.pastas.findMany({
    columns: {
      updatedAt: false,
      publisherTwitchId: false,
    },
    where: and(
      eq(pastas.publisherTwitchId, publisherTwitchId),
      lt(pastas.id, pastaId),
    ),
    orderBy: [pastas.publisherTwitchId, desc(pastas.id)],
    limit: CURSOR_BASED_PASTAS_COUNT,
    with: {
      tags: true,
    },
  });
}

export async function getPastas(
  twitchUserId: string,
  next: Pasta["id"] | null,
) {
  if (next === null) {
    const pastas = await getFirstPagePastas(twitchUserId);
    const next =
      pastas.length === FIRST_PAGE_PASTAS_COUNT
        ? pastas[pastas.length - 1].id
        : null;
    return {
      pastas,
      next,
    };
  }
  const pastas = await getNextPagePastas(twitchUserId, next);
  return {
    pastas,
    next:
      pastas.length === CURSOR_BASED_PASTAS_COUNT
        ? pastas[pastas.length - 1].id
        : null,
  };
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
