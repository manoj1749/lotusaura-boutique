CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`image_url` text NOT NULL,
	`image_path` text NOT NULL,
	`category` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP
);

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_id ON products(id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_timestamp ON products(timestamp);

-- Product images table (ONLY if this table exists)
CREATE INDEX IF NOT EXISTS idx_product_images_pid ON product_images(product_id);
