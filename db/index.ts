import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import {
  pastas,
  pastasTags,
  tagsToPastas,
  type PastaPublicity,
} from "./schema";
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
      await tx
        .insert(pastasTags)
        .values(tags.map((value) => ({ value })))
        .onConflictDoNothing();
      const pastaUuid = pasta.uuid;
      await tx
        .insert(tagsToPastas)
        .values(tags.map((tagValue) => ({ tagValue, pastaUuid })));
    }
    return {
      ...pasta,
      tags,
    };
  });
}

export function getPastas(publisherTwitchId: string) {
  return db.query.pastas.findMany({
    where: (pastas, { eq }) => eq(pastas.publisherTwitchId, publisherTwitchId),
    with: {
      tags: true,
    },
  });
}

// LINK: https://orm.drizzle.team/docs/joins#many-to-many-example

export function getPastasWithNoTags(publisherTwitchId: string) {
  return db
    .select()
    .from(pastas)
    .where(eq(pastas.publisherTwitchId, publisherTwitchId));
}
