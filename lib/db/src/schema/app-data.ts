import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const appDataTable = pgTable("app-data", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});