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
  stock: integer("stock").notNull().default(0),
  tags: text("tags"),
  tagColor: text("tag_color"),
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
  // New fields for extended product details
  dispatchTime: text("dispatch_time"),
  material: text("material"),
  washCare: text("wash_care"),
  pattern: text("pattern"),
});

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  imageUrl: text("image_url").notNull(),
  imagePath: text("image_path").notNull(),
  displayOrder: integer("display_order").default(0),
});
