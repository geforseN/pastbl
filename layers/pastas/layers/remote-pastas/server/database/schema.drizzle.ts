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
import { pastasConfig } from "../../../../app.config.ts";
import { twitchConfig } from "../../../../../twitch/app.config.ts";

export const pastasPublicityEnum = pgEnum("pasta_publicity", pastasPublicity);

const pastasColumns = {
  id: serial("id").primaryKey(),
  text: varchar("text", {
    length: pastasConfig.pastaText.length.max,
  }).notNull(),
  publishedAt: timestamp("published_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at", { mode: "string" }),
  publisherTwitchId: varchar("publisher_twitch_id", {
    length: twitchConfig.twitchUser.id.length.max,
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
    publisherNewest: index("publisher_newest").on(
      publisherTwitchId,
      publishedAt.desc(),
    ),
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
  value: varchar("tag", { length: pastasConfig.pastaTag.length.max }).notNull(),
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
