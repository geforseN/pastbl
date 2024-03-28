import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { pastas, pastasTags, type Pasta } from "~/db/schema";

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

const getFirstPagePastas = db.query.pastas
  .findMany({
    columns: {
      updatedAt: false,
      publisherTwitchId: false,
    },
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

const getNextPagePastas = db.query.pastas
  .findMany({
    columns: {
      updatedAt: false,
      publisherTwitchId: false,
    },
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
  return pastas[length - 1].id;
}

const getFirstPastasCursor = getPastasCursor.bind(
  null,
  CURSOR_FIRST_PAGE_PASTAS_COUNT,
);
const getNextPastasCursor = getPastasCursor.bind(
  null,
  CURSOR_NEXT_PAGES_PASTAS_COUNT,
);

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
  await db
    .delete(pastas)
    .where(
      and(
        eq(pastas.publisherTwitchId, publisherTwitchId),
        eq(pastas.id, pastaId),
      ),
    );
}
