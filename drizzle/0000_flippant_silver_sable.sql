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
