import assert from "node:assert";
import { and, eq, sql } from "drizzle-orm";
import { database } from "~~/database";
import { pastas, pastasTags, type Pasta } from "~~/database/schema";

export function createPasta(
  text: string,
  tags: string[],
  publisherTwitchId: string,
  publicity: PastaPublicity,
) {
  return database.transaction(async (transaction) => {
    const [pasta] = await transaction
      .insert(pastas)
      .values({ text, publisherTwitchId, publicity })
      .returning();
    assert.ok(pasta);
    if (tags.length > 0) {
      const pastaId = pasta.id;
      await transaction
        .insert(pastasTags)
        .values(tags.map((value) => ({ value, pastaId })))
        .onConflictDoNothing();
    }
    return {
      ...pasta,
      tags,
    };
  });
}

// TODO: use 'with clause' or/and 'prepared statement' in SQL queries

const CURSOR_FIRST_PAGE_PASTAS_COUNT = 15 as const;

const getFirstPagePastas = database.query.pastas
  .findMany({
    columns: { publisherTwitchId: false },
    where: (pastas, { eq }) =>
      eq(pastas.publisherTwitchId, sql.placeholder("publisherTwitchId")),
    orderBy: (pastas, { desc }) => [pastas.publisherTwitchId, desc(pastas.id)],
    limit: CURSOR_FIRST_PAGE_PASTAS_COUNT,
    with: {
      tags: {
        columns: { value: true },
      },
    },
  })
  .prepare("get_first_pastas");

const CURSOR_NEXT_PAGES_PASTAS_COUNT = 10 as const;

const getNextPagePastas = database.query.pastas
  .findMany({
    columns: { publisherTwitchId: false },
    where: (pastas, { and, eq, lt }) =>
      and(
        eq(pastas.publisherTwitchId, sql.placeholder("publisherTwitchId")),
        lt(pastas.id, sql.placeholder("pastaId")),
      ),
    orderBy: (pastas, { desc }) => [pastas.publisherTwitchId, desc(pastas.id)],
    limit: CURSOR_NEXT_PAGES_PASTAS_COUNT,
    with: {
      tags: {
        columns: { value: true },
      },
    },
  })
  .prepare("get_next_pastas");

function getPastasCursor(length: number, pastas: { id: number }[]) {
  if (pastas.length !== length) {
    return null;
  }
  const pasta = pastas[length - 1];
  assert.ok(pasta);
  return pasta.id;
}

const getFirstPastasCursor = (pastas: { id: number }[]) =>
  getPastasCursor(CURSOR_FIRST_PAGE_PASTAS_COUNT, pastas);

const getNextPastasCursor = (pastas: { id: number }[]) =>
  getPastasCursor(CURSOR_NEXT_PAGES_PASTAS_COUNT, pastas);

// LINK: https://orm.drizzle.team/learn/guides/cursor-based-pagination

export async function getPastas(
  publisherTwitchId: string,
  pastaId: Pasta["id"] | null,
) {
  if (pastaId === null) {
    const pastas = await getFirstPagePastas.execute({
      publisherTwitchId,
    });
    const cursor = getFirstPastasCursor(pastas);
    return {
      pastas,
      cursor,
    };
  }
  const pastas = await getNextPagePastas.execute({
    publisherTwitchId,
    pastaId,
  });
  return {
    pastas,
    cursor: getNextPastasCursor(pastas),
  };
}

export async function deletePasta(
  publisherTwitchId: Pasta["publisherTwitchId"],
  pastaId: Pasta["id"],
) {
  await database
    .delete(pastas)
    .where(
      and(
        eq(pastas.publisherTwitchId, publisherTwitchId),
        eq(pastas.id, pastaId),
      ),
    );
}

export async function patchPasta(
  pastaId: Pasta["id"],
  publisherTwitchId: Pasta["publisherTwitchId"],
  entries: Partial<Pick<Pasta, "text" | "publicity">>,
) {
  // TODO: with transaction add old pastas in previousPastas table
  const [pasta] = await database
    .update(pastas)
    .set({ ...entries, lastUpdatedAt: sql`now()` })
    .where(
      and(
        eq(pastas.publisherTwitchId, publisherTwitchId),
        eq(pastas.id, pastaId),
      ),
    )
    .returning();
  assert.ok(pasta, "Failed to patch pasta");
  return pasta;
}
