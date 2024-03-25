import {
  pgTable,
  timestamp,
  index,
  uuid,
  varchar,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const TAG_MAX_LENGTH = 128;
export const MAX_TAGS_IN_PASTA = 10;
const TWITCH_USER_ID_LENGTH = 64;
export const PASTA_TEXT_LENGTH = 1984;
const PREVIOUS_PASTA_TAGS_STRING_LENGTH =
  TAG_MAX_LENGTH * MAX_TAGS_IN_PASTA + (MAX_TAGS_IN_PASTA - 1);
const TWITCH_USER_NICK_LENGTH = 25;

export const pastaPublicityEnum = pgEnum("pasta_publicity", [
  "public",
  "private",
]);
export type PastaPublicity = (typeof pastaPublicityEnum.enumValues)[number];

export const pastas = pgTable(
  "pastas",
  {
    uuid: uuid("uuid").primaryKey().notNull().defaultRandom(),
    text: varchar("text", { length: PASTA_TEXT_LENGTH }).notNull(),
    publishedAt: timestamp("published_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    publisherTwitchId: varchar("publisher_twitch_id", {
      length: TWITCH_USER_ID_LENGTH,
    })
      .notNull()
      .references(() => twitchUsers.id),
    publicity: pastaPublicityEnum("publicity").notNull().default("public"),
  },
  ({ publisherTwitchId }) => ({
    ownerTwitchIdIndex: index("pastas_index").on(publisherTwitchId),
  }),
);

export const pastasRelations = relations(pastas, ({ one, many }) => ({
  author: one(twitchUsers, {
    fields: [pastas.publisherTwitchId],
    references: [twitchUsers.id],
  }),
  tags: many(pastasTags),
}));

export const pastasTags = pgTable(
  "pastas_tags",
  {
    value: varchar("tag", { length: TAG_MAX_LENGTH }).notNull().primaryKey(),
  },
  ({ value }) => ({
    tagIndex: index("tags_index").on(value),
  }),
);

export const tagsRelations = relations(pastasTags, ({ many }) => ({
  pastas: many(tagsToPastas),
}));

export const tagsToPastas = pgTable(
  "tags_to_pastas",
  {
    tagValue: varchar("tag_id")
      .notNull()
      .references(() => pastasTags.value),
    pastaUuid: uuid("pasta_uuid")
      .notNull()
      .references(() => pastas.uuid),
  },
  ({ tagValue, pastaUuid }) => ({
    pk: primaryKey({ columns: [tagValue, pastaUuid] }),
  }),
);

export const tagsToPastasRelations = relations(tagsToPastas, ({ one }) => ({
  tag: one(pastasTags, {
    fields: [tagsToPastas.tagValue],
    references: [pastasTags.value],
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
  publisherTwitchId: varchar("publisher_twitch_id")
    .notNull()
    .references(() => twitchUsers.id),
  lastUpdatedAt: timestamp("last_updated_at").notNull(),
  tagsString: varchar("tags_string", {
    length: PREVIOUS_PASTA_TAGS_STRING_LENGTH,
  }).notNull(),
});

export const previousPastasRelations = relations(previousPastas, ({ one }) => ({
  author: one(twitchUsers, {
    fields: [previousPastas.publisherTwitchId],
    references: [twitchUsers.id],
  }),
  latestPasta: one(pastas, {
    fields: [previousPastas.uuid],
    references: [pastas.uuid],
    relationName: "latestPasta",
  }),
}));

export const twitchUsers = pgTable("twitch_users", {
  id: varchar("id", { length: TWITCH_USER_ID_LENGTH }).primaryKey().notNull(),
  nickname: varchar("nickname", { length: TWITCH_USER_NICK_LENGTH })
    .notNull()
    .unique(),
  login: varchar("login", { length: TWITCH_USER_NICK_LENGTH })
    .notNull()
    .unique(),
  description: varchar("description", { length: 192 }),
  profileImageUrl: varchar("profile_image_url", { length: 192 }),
});
export type TwitchUser = typeof twitchUsers.$inferSelect;
export type InsertTwitchUser = typeof twitchUsers.$inferInsert;

export const twitchUsersRelations = relations(twitchUsers, ({ many }) => ({
  author: many(pastas, { relationName: "author" }),
}));
