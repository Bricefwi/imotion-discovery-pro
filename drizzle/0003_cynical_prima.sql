CREATE TABLE `cdc_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultantId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('web','mobile','ecommerce','saas','custom') NOT NULL,
	`sections` json NOT NULL,
	`isDefault` boolean DEFAULT false,
	`isPublic` boolean DEFAULT false,
	`usageCount` int DEFAULT 0,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cdc_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`siret` varchar(14),
	`siren` varchar(9),
	`companyName` varchar(255) NOT NULL,
	`legalForm` varchar(100),
	`sector` varchar(100),
	`subSector` varchar(100),
	`employeeCount` enum('1','2-10','11-50','51-200','201-500','500+'),
	`annualRevenue` enum('<100k','100k-500k','500k-1M','1M-5M','5M-10M','10M+'),
	`foundedYear` int,
	`website` varchar(500),
	`phone` varchar(50),
	`address` text,
	`city` varchar(100),
	`postalCode` varchar(10),
	`country` varchar(100) DEFAULT 'France',
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`jobTitle` varchar(150) NOT NULL,
	`department` varchar(100),
	`seniority` enum('<1year','1-3years','3-5years','5-10years','10+years'),
	`isDecisionMaker` boolean NOT NULL DEFAULT false,
	`decisionLevel` enum('final','influencer','recommender','user'),
	`companyDescription` text,
	`mainProducts` text,
	`targetMarket` text,
	`competitors` json,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`verificationToken` varchar(255),
	`verifiedAt` timestamp,
	`onboardingCompleted` boolean NOT NULL DEFAULT false,
	`onboardingStep` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `template_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultantId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`variables` json,
	`isPublic` boolean DEFAULT false,
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `template_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('visitor','client','consultant','admin') NOT NULL DEFAULT 'visitor';--> statement-breakpoint
ALTER TABLE `cdc_templates` ADD CONSTRAINT `cdc_templates_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `client_profiles` ADD CONSTRAINT `client_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template_sections` ADD CONSTRAINT `template_sections_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;