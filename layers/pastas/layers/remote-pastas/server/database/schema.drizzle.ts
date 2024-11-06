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
  id: serial().primaryKey(),
  text: varchar({
    length: pastasConfig.pastaText.length.max,
  }).notNull(),
  publishedAt: timestamp({ mode: "string" })
    .notNull()
    .defaultNow(),
  lastUpdatedAt: timestamp({ mode: "string" }),
  publisherTwitchId: varchar({
    length: twitchConfig.twitchUser.id.length.max,
  }).notNull(),
  publicity: pastasPublicityEnum()
    .notNull()
    .default(defaultPastaPublicity),
} as const;

export const pastas = pgTable(
  "pastas",
  pastasColumns,
  ({ publisherTwitchId, publishedAt }) => [
    index("publisher").on(publisherTwitchId),
    index("publisher_newest").on(
      publisherTwitchId,
      publishedAt.desc(),
    ),
  ],
);

export const pastasRelations = relations(pastas, ({ many }) => ({
  tags: many(pastasTags),
}));

export type Pasta = typeof pastas.$inferSelect;

const pastasTagsColumns = {
  pastaId: integer()
    .notNull()
    .references(() => pastas.id, {
      onDelete: "cascade",
    }),
  value: varchar("tag", { length: pastasConfig.pastaTag.length.max }).notNull(),
} as const;

export const pastasTags = pgTable(
  "pastas_tags",
  pastasTagsColumns,
  ({ pastaId, value }) => [
    index("pastas").on(pastaId),
    index("values").on(value),
    primaryKey({ columns: [pastaId, value] }),
  ],
);

export const tagsRelations = relations(pastasTags, ({ one }) => ({
  pasta: one(pastas, {
    fields: [pastasTags.pastaId],
    references: [pastas.id],
  }),
}));
