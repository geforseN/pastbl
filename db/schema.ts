import {
  integer,
  pgTable,
  timestamp,
  index,
  uuid,
  varchar,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const MAX_TAG_LENGTH = 128;
const MAX_TAGS_IN_PASTA = 10;
const TWITCH_USER_ID_LENGTH = 64;
const PASTA_TEXT_LENGTH = 1984;

export const pastas = pgTable(
  "pastas",
  {
    uuid: uuid("uuid").primaryKey().notNull().defaultRandom(),
    text: varchar("text", { length: PASTA_TEXT_LENGTH }).notNull(),
    publishedAt: timestamp("published_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    authorTwitchId: varchar("author_twitch_id", {
      length: TWITCH_USER_ID_LENGTH,
    })
      .notNull()
      .references(() => twitchUsers.id),
  },
  (pastas) => ({
    ownerTwitchIdIndex: index("pastas_index").on(pastas.authorTwitchId),
  }),
);

export const pastasRelations = relations(pastas, ({ one, many }) => ({
  author: one(twitchUsers, {
    fields: [pastas.authorTwitchId],
    references: [twitchUsers.id],
  }),
  tags: many(pastasTags),
}));

export const pastasTags = pgTable(
  "pastas_tags",
  {
    id: serial("id").primaryKey(),
    pastaUuid: integer("pasta_uuid")
      .notNull()
      .references(() => pastas.uuid),
    value: varchar("tag", { length: MAX_TAG_LENGTH }).notNull(),
  },
  (tags) => ({
    pk: primaryKey({ columns: [pastas.uuid, tags.value] }),
    tagIndex: index("tags_index").on(tags.value),
    pastaIdIndex: index("tags_index").on(tags.pastaUuid),
  }),
);

export const tagsRelations = relations(pastasTags, ({ one }) => ({
  pasta: one(pastas, {
    fields: [pastasTags.pastaUuid],
    references: [pastas.uuid],
  }),
}));

export const tagsToPastas = pgTable(
  "tags_to_pastas",
  {
    tagId: varchar("tag_id")
      .notNull()
      .references(() => pastasTags.id),
    pastaUuid: integer("pasta_uuid")
      .notNull()
      .references(() => pastas.uuid),
  },
  ({ pastaUuid, tagId }) => ({
    pk: primaryKey({ columns: [tagId, pastaUuid] }),
  }),
);

export const tagsToPastasRelations = relations(tagsToPastas, ({ one }) => ({
  tag: one(pastasTags, {
    fields: [tagsToPastas.tagId],
    references: [pastasTags.id],
  }),
  pasta: one(pastas, {
    fields: [tagsToPastas.pastaUuid],
    references: [pastas.uuid],
  }),
}));

export const previousPastas = pgTable("previous_pastas", {
  uuid: uuid("uuid")
    .primaryKey()
    .notNull()
    .references(() => pastas.uuid),
  text: varchar("text", { length: PASTA_TEXT_LENGTH }).notNull(),
  authorTwitchId: varchar("author_twitch_id")
    .notNull()
    .references(() => twitchUsers.id),
  lastUpdatedAt: timestamp("last_updated_at").notNull(),
  tagsString: varchar("tags_string", {
    length: MAX_TAG_LENGTH * MAX_TAGS_IN_PASTA + (MAX_TAGS_IN_PASTA - 1),
  }).notNull(),
});

export const twitchUsers = pgTable("twitch_users", {
  id: varchar("id", { length: TWITCH_USER_ID_LENGTH }).primaryKey().notNull(),
  nickname: varchar("nickname", { length: 25 }).notNull(),
  login: varchar("login", { length: 25 }).notNull(),
  description: varchar("description", { length: 192 }),
  profileUrl: varchar("profile_url", { length: 192 }),
});
export type TwitchUser = typeof twitchUsers.$inferSelect;

export const twitchUsersRelations = relations(twitchUsers, ({ many }) => ({
  author: many(pastas, { relationName: "author" }),
}));

export const previousPastasRelations = relations(previousPastas, ({ one }) => ({
  author: one(twitchUsers, {
    fields: [previousPastas.authorTwitchId],
    references: [twitchUsers.id],
  }),
  latestPasta: one(pastas, {
    fields: [previousPastas.uuid],
    references: [pastas.uuid],
    relationName: "latestPasta",
  }),
}));
