import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: int("completed", { mode: "boolean" }).notNull().default(false),
  created: int("created", { mode: "timestamp" }).notNull(),
  updated: int("updated", { mode: "timestamp" }),
});

export type TaskSchema = typeof tasks.$inferSelect;
