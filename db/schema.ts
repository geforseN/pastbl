import {
  pgTable,
  timestamp,
  index,
  varchar,
  primaryKey,
  pgEnum,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TAG_MAX_LENGTH } from "~/server/utils/pastas-tags";
import {
  defaultPastaPublicity,
  PASTA_TEXT_LENGTH,
  pastasPublicity,
} from "~/server/utils/pastas";

const TWITCH_USER_ID_LENGTH = 64;

export const pastasPublicityEnum = pgEnum("pasta_publicity", pastasPublicity);

const pastasColumns = {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: PASTA_TEXT_LENGTH }).notNull(),
  publishedAt: timestamp("published_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  publisherTwitchId: varchar("publisher_twitch_id", {
    length: TWITCH_USER_ID_LENGTH,
  }).notNull(),
  publicity: pastasPublicityEnum("publicity")
    .notNull()
    .default(defaultPastaPublicity),
} as const;

export const pastas = pgTable(
  "pastas",
  pastasColumns,
  ({ publisherTwitchId, publishedAt }) => ({
    publisher: index("publisher").on(publisherTwitchId),
    publisherNewest: index("publisher_newest")
      .on(publisherTwitchId, publishedAt)
      .desc(),
  }),
);

export const pastasRelations = relations(pastas, ({ many }) => ({
  tags: many(pastasTags),
}));

export type Pasta = typeof pastas.$inferSelect;

const pastasTagsColumns = {
  pastaId: integer("pasta_id")
    .notNull()
    .references(() => pastas.id, {
      onDelete: "cascade",
    }),
  value: varchar("tag", { length: TAG_MAX_LENGTH }).notNull(),
} as const;

export const pastasTags = pgTable(
  "pastas_tags",
  pastasTagsColumns,
  ({ pastaId, value }) => ({
    pastas: index("pastas").on(pastaId),
    values: index("values").on(value),
    pk: primaryKey({ columns: [pastaId, value] }),
  }),
);

export const tagsRelations = relations(pastasTags, ({ one }) => ({
  pasta: one(pastas, {
    fields: [pastasTags.pastaId],
    references: [pastas.id],
  }),
}));
