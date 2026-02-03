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

CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_published_id ON products(published, id);
CREATE INDEX IF NOT EXISTS idx_product_images_pid ON product_images(product_id);