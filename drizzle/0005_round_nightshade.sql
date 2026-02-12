CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int,
	`projectId` int NOT NULL,
	`consultantId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`status` enum('draft','sent','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`totalHT` decimal(10,2) NOT NULL,
	`vatRate` decimal(5,2) NOT NULL DEFAULT '20.00',
	`vatAmount` decimal(10,2) NOT NULL,
	`totalTTC` decimal(10,2) NOT NULL,
	`lineItems` json NOT NULL,
	`paymentMethod` varchar(50),
	`paymentReference` varchar(255),
	`dueDate` timestamp NOT NULL,
	`paidAt` timestamp,
	`legalMentions` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`consultantId` int NOT NULL,
	`quoteNumber` varchar(50) NOT NULL,
	`status` enum('draft','sent','accepted','rejected','expired') NOT NULL DEFAULT 'draft',
	`directCosts` decimal(10,2) NOT NULL,
	`indirectCosts` decimal(10,2) NOT NULL,
	`totalHT` decimal(10,2) NOT NULL,
	`vatRate` decimal(5,2) NOT NULL DEFAULT '20.00',
	`vatAmount` decimal(10,2) NOT NULL,
	`totalTTC` decimal(10,2) NOT NULL,
	`lineItems` json NOT NULL,
	`paymentTerms` text,
	`deliveryTerms` text,
	`validityDays` int NOT NULL DEFAULT 30,
	`cguAccepted` boolean NOT NULL DEFAULT false,
	`cguAcceptedAt` timestamp,
	`cguAcceptedBy` int,
	`sentAt` timestamp,
	`acceptedAt` timestamp,
	`rejectedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotes_quoteNumber_unique` UNIQUE(`quoteNumber`)
);
--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_consultantId_users_id_fk` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_cguAcceptedBy_users_id_fk` FOREIGN KEY (`cguAcceptedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;