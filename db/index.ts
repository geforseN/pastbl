import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import {
  pastas,
  pastasTags,
  tagsToPastas,
  twitchUsers,
  type InsertTwitchUser,
} from "./schema";
import * as schema from "./schema";

export const client = postgres(env.databaseUrl);
export const db = drizzle(client, { schema });

export function createPasta(
  text: string,
  tags: string[],
  authorTwitchId: `${number}`,
) {
  return db.transaction(async (tx) => {
    const [pasta] = await tx
      .insert(pastas)
      .values({ text, authorTwitchId })
      .returning();
    await tx
      .insert(pastasTags)
      .values(tags.map((value) => ({ value })))
      .onConflictDoNothing();
    const pastaUuid = pasta.uuid;
    await tx
      .insert(tagsToPastas)
      .values(tags.map((tagValue) => ({ tagValue, pastaUuid })));
    return {
      ...pasta,
      tags,
    };
  });
}

export function getPastas(authorTwitchId: `${number}`) {
  return db.query.pastas.findMany({
    where: (pastas, { eq }) => eq(pastas.authorTwitchId, authorTwitchId),
    with: {
      tags: true,
    },
  });
}

// LINK: https://orm.drizzle.team/docs/joins#many-to-many-example

export function getPastasWithNoTags(authorTwitchId: `${number}`) {
  return db
    .select()
    .from(pastas)
    .where(eq(pastas.authorTwitchId, authorTwitchId));
}

export function upsertTwitchUser(twitchUser: InsertTwitchUser) {
  return db
    .insert(twitchUsers)
    .values(twitchUser)
    .onConflictDoUpdate({
      target: [twitchUsers.id],
      set: twitchUser,
    });
}
