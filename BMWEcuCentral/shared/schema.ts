import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // 'xdf', 'bin', 'a2l'
  bmwModel: text("bmw_model").notNull(), // 'e46', 'e39', 'e60', etc.
  motor: text("motor").notNull(), // 'm54', 'n52', etc.
  description: text("description"),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const tutorials = pgTable("tutorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  youtubeId: text("youtube_id").notNull(),
  category: text("category").notNull(), // 'basic', 'advanced', 'troubleshooting', 'tools'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  filename: true,
  uploadedAt: true,
});

export const insertTutorialSchema = createInsertSchema(tutorials).omit({
  id: true,
  youtubeId: true,
  createdAt: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;
