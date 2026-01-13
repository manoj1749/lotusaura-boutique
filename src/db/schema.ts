import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  imagePath: text("image_path").notNull(),
  category: text("category"),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});
