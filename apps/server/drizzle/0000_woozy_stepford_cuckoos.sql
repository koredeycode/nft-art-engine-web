CREATE TABLE `elements` (
	`id` text PRIMARY KEY NOT NULL,
	`layer_id` text NOT NULL,
	`filename` text NOT NULL,
	`weight` integer DEFAULT 1,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`layer_id`) REFERENCES `layers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generation_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`total_editions` integer NOT NULL,
	`current_edition` integer DEFAULT 0,
	`progress` real DEFAULT 0,
	`error` text,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `layers` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`blend_mode` text DEFAULT 'source-over',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
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
	`dna_tolerance` integer DEFAULT 2,
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
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);