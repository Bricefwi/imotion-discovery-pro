CREATE TABLE `consultant_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`consultantId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultant_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`type` enum('cdc','contract','upload') NOT NULL,
	`title` varchar(255) NOT NULL,
	`s3Key` varchar(500) NOT NULL,
	`s3Url` varchar(1000) NOT NULL,
	`format` enum('pdf','docx','png','jpg','jpeg') NOT NULL,
	`generatedBy` enum('ai','user','consultant') NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`role` enum('user','assistant','consultant','system') NOT NULL,
	`content` text NOT NULL,
	`phase` int NOT NULL,
	`extractedData` json,
	`sentiment` enum('positive','neutral','negative'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultantId` int NOT NULL,
	`projectId` int,
	`type` enum('new_project','phase_completed','intervention_required','document_generated','high_score') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` enum('active','completed','archived') NOT NULL DEFAULT 'active',
	`currentPhase` int NOT NULL DEFAULT 1,
	`phaseProgress` json,
	`score` int DEFAULT 0,
	`urgency` enum('low','medium','high') DEFAULT 'medium',
	`budget` varchar(100),
	`complexity` enum('simple','medium','complex') DEFAULT 'medium',
	`extractedData` json,
	`psychologicalProfile` json,
	`qualificationFlags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('client','consultant','admin') NOT NULL DEFAULT 'client';--> statement-breakpoint
ALTER TABLE `consultant_notes` ADD CONSTRAINT `consultant_notes_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultant_notes` ADD CONSTRAINT `consultant_notes_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_clientId_users_id_fk` FOREIGN KEY (`clientId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;