CREATE TABLE `payment_phases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`phaseNumber` int NOT NULL,
	`phaseName` varchar(100) NOT NULL,
	`percentage` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
	`dueDate` timestamp NOT NULL,
	`paidAt` timestamp,
	`paymentMethod` varchar(50),
	`paymentReference` varchar(255),
	`invoiceId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_phases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_acceptances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`userId` int NOT NULL,
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	`userAgent` text,
	`cguVersion` varchar(20) NOT NULL,
	`cgvVersion` varchar(20) NOT NULL,
	`acknowledgmentSent` boolean DEFAULT false,
	`acknowledgmentPdfUrl` text,
	CONSTRAINT `quote_acceptances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reception_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`functionality` varchar(255) NOT NULL,
	`specification` text NOT NULL,
	`status` enum('conforme','reserve','non_conforme') NOT NULL DEFAULT 'conforme',
	`comments` text,
	`orderIndex` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reception_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reception_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`projectId` int,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`validatedAt` timestamp,
	`clientSignature` text,
	`clientSignedAt` timestamp,
	`consultantSignature` text,
	`consultantSignedAt` timestamp,
	`status` enum('draft','pending_validation','validated','rejected') NOT NULL DEFAULT 'draft',
	`globalStatus` enum('conforme','reserve','non_conforme') DEFAULT 'conforme',
	`clientComments` text,
	`consultantComments` text,
	`pdfUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reception_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `payment_phases` ADD CONSTRAINT `payment_phases_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_phases` ADD CONSTRAINT `payment_phases_invoiceId_invoices_id_fk` FOREIGN KEY (`invoiceId`) REFERENCES `invoices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_acceptances` ADD CONSTRAINT `quote_acceptances_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_acceptances` ADD CONSTRAINT `quote_acceptances_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reception_items` ADD CONSTRAINT `reception_items_reportId_reception_reports_id_fk` FOREIGN KEY (`reportId`) REFERENCES `reception_reports`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reception_reports` ADD CONSTRAINT `reception_reports_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reception_reports` ADD CONSTRAINT `reception_reports_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;