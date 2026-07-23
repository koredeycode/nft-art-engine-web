CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`network` text DEFAULT 'eth',
	`name_prefix` text,
	`description` text,
	`base_uri` text,
	`canvas_width` integer DEFAULT 4096,
	`canvas_height` integer DEFAULT 4096,
	`smoothing` integer DEFAULT true,
	`rarity_delim` text DEFAULT '#',
	`dna_tolerance` integer DEFAULT 10000,
	`bg_generate` integer DEFAULT false,
	`bg_brightness` text,
	`bg_static` integer DEFAULT false,
	`bg_default` text,
	`shuffle_order` integer DEFAULT false,
	`extra_metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "user_id", "name", "network", "name_prefix", "description", "base_uri", "canvas_width", "canvas_height", "smoothing", "rarity_delim", "dna_tolerance", "bg_generate", "bg_brightness", "bg_static", "bg_default", "shuffle_order", "extra_metadata", "created_at", "updated_at") SELECT "id", "user_id", "name", "network", "name_prefix", "description", "base_uri", "canvas_width", "canvas_height", "smoothing", "rarity_delim", "dna_tolerance", "bg_generate", "bg_brightness", "bg_static", "bg_default", "shuffle_order", "extra_metadata", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `sessions` ADD `token` text NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `ip_address` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD `updated_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `image` text;