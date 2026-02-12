CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`companyId` int,
	`contactId` int,
	`consultantId` int NOT NULL,
	`type` enum('call','email','meeting','note','task') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text,
	`scheduledAt` timestamp,
	`completedAt` timestamp,
	`status` enum('planned','completed','cancelled') DEFAULT 'planned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`sector` varchar(100),
	`size` enum('solo','small','medium','large'),
	`website` varchar(500),
	`address` text,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`userId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`role` varchar(100),
	`email` varchar(320),
	`phone` varchar(50),
	`isPrimary` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cron_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobType` varchar(100) NOT NULL,
	`status` enum('success','failed') NOT NULL,
	`executedAt` timestamp NOT NULL DEFAULT (now()),
	`details` json,
	`errorMessage` text,
	CONSTRAINT `cron_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`type` enum('incomplete_project','no_response','quote_followup','blocked_project','manual') NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`sent` boolean NOT NULL DEFAULT false,
	`sentAt` timestamp,
	`emailSubject` varchar(255),
	`emailBody` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `projects` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `pipelineStage` enum('lead','qualified','quote_sent','negotiation','won','lost') DEFAULT 'lead' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `estimatedValue` decimal(10,2);--> statement-breakpoint
ALTER TABLE `projects` ADD `closingProbability` int DEFAULT 50;--> statement-breakpoint
ALTER TABLE `projects` ADD `expectedClosingDate` timestamp;--> statement-breakpoint
ALTER TABLE `projects` ADD `actualClosingDate` timestamp;--> statement-breakpoint
ALTER TABLE `projects` ADD `lostReason` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `lastContactDate` timestamp;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_contactId_contacts_id_fk` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reminders` ADD CONSTRAINT `reminders_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;